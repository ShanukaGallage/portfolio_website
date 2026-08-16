import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

const QUERY = `
  query($userName:String!) {
    user(login: $userName){
      contributionsCollection {
        contributionCalendar {
          totalContributions
        }
      }
    }
  }
`;

export async function GET() {
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json({ error: "Missing GITHUB_TOKEN" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { userName: "ShanukaGallage" },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
       throw new Error(data.errors[0]?.message || "GraphQL Error");
    }

    const commits = data?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? 0;

    return NextResponse.json({ commits });
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
