import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing owner or repo parameters" }, { status: 400 });
  }

  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json({ error: "GitHub token missing" }, { status: 500 });
  }

  try {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    };

    // Fetch repository data
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      throw new Error(`Repo fetch failed with status ${repoRes.status}`);
    }
    const repoData = await repoRes.json();

    // Fetch README
    let readmeText = "";
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        // Decode base64
        readmeText = Buffer.from(readmeData.content, 'base64').toString('utf-8');
      }
    } catch (readmeErr) {
      console.warn("Failed to fetch README:", readmeErr);
    }

    return NextResponse.json({
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      updatedAt: repoData.updated_at,
      readme: readmeText,
    });
  } catch (error) {
    console.error("Error fetching GitHub repo:", error);
    return NextResponse.json({ error: "Failed to fetch repository data", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
