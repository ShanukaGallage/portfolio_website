export interface Project {
  hash: string;
  date: string;
  title: string;
  highlight: string;
  description: string;
  features?: string[];
  images: string[];
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  status: "merged" | "in-progress" | "planned";
}

export const projects: Project[] = [
  {
    hash: "a3f8b2c",
    date: "2026-07-20",
    title: "Terraform AWS Multi-Tier Infrastructure",
    highlight: "Production-grade AWS environment provisioned via Terraform.",
    description:
      "Provisioned a production-grade AWS environment with complete network isolation and auto-scaling capabilities.",
    features: [
      "VPC with public/private subnets, NAT Gateways, and Application Load Balancers.",
      "EC2 Auto Scaling Groups for high availability and fault tolerance.",
      "RDS PostgreSQL and S3 buckets for secure, persistent storage.",
      "Remote state management via S3 + DynamoDB locking.",
      "Modularized Terraform configurations for dev, staging, and prod environments."
    ],
    images: [
      "https://placehold.co/800x500/0d1117/00ff41/png?text=AWS+Architecture+Diagram",
      "https://placehold.co/800x500/0d1117/00ff41/png?text=Terraform+Apply+Output",
      "https://placehold.co/800x500/0d1117/00ff41/png?text=AWS+Console+Resources"
    ],
    tags: ["terraform", "aws", "vpc", "rds", "s3"],
    repoUrl: "https://github.com/ShanukaGallage/terraform-aws-infra",
    status: "merged",
  },
  {
    hash: "e7d1f4a",
    date: "2026-06-10",
    title: "GitHub Actions CI/CD Pipeline",
    highlight: "End-to-end automated deployment pipeline for microservices.",
    description:
      "End-to-end automated deployment pipeline designed for modern Node.js microservices.",
    features: [
      "Automated linting and unit testing on every Pull Request.",
      "Docker image build and push to GitHub Container Registry (GHCR).",
      "Trivy vulnerability scanning to ensure container security.",
      "Automated deployment to Kubernetes via ArgoCD GitOps sync.",
      "Matrix builds tested across Node versions 18, 20, and 22."
    ],
    images: [
      "https://placehold.co/800x500/0d1117/00ff41/png?text=GitHub+Actions+Workflow",
      "https://placehold.co/800x500/0d1117/00ff41/png?text=Trivy+Scan+Results",
      "https://placehold.co/800x500/0d1117/00ff41/png?text=ArgoCD+Dashboard"
    ],
    tags: ["github-actions", "docker", "argocd", "ci-cd"],
    repoUrl: "https://github.com/ShanukaGallage/cicd-pipeline",
    status: "merged",
  },
  {
    hash: "b9c3e6d",
    date: "2026-05-01",
    title: "Kubernetes Helm Chart Collection",
    highlight: "Custom Helm charts for scalable K8s microservice deployments.",
    description:
      "A comprehensive collection of custom Helm charts for deploying scalable microservices to Kubernetes clusters.",
    features: [
      "Configurable replicas, resource limits, and CPU/Memory requests.",
      "Horizontal Pod Autoscaling (HPA) integration for dynamic scaling.",
      "Dynamic ingress rules and TLS configuration for external access.",
      "Centralized ConfigMap and Secret management.",
      "Thoroughly tested across AWS EKS and local k3d environments."
    ],
    images: [
      "https://placehold.co/800x500/0d1117/00ff41/png?text=Helm+Chart+Structure",
      "https://placehold.co/800x500/0d1117/00ff41/png?text=kubectl+get+pods",
      "https://placehold.co/800x500/0d1117/00ff41/png?text=EKS+Cluster+View"
    ],
    tags: ["kubernetes", "helm", "eks", "k3d"],
    repoUrl: "https://github.com/ShanukaGallage/helm-charts",
    status: "merged",
  },
  {
    hash: "f2a8d1e",
    date: "2026-08-01",
    title: "Prometheus + Grafana Monitoring",
    highlight: "Full observability stack on Kubernetes with custom dashboards.",
    description:
      "Full observability stack deployed on Kubernetes to monitor cluster health and application performance.",
    features: [
      "Deployed seamlessly using the kube-prometheus-stack Helm chart.",
      "Custom Grafana dashboards tailored for SLIs/SLOs and node metrics.",
      "Alertmanager configured with real-time Slack and PagerDuty integrations.",
      "ServiceMonitors set up for automated application metric scraping."
    ],
    images: [
      "https://placehold.co/800x500/0d1117/00ff41/png?text=Grafana+Dashboard",
      "https://placehold.co/800x500/0d1117/00ff41/png?text=Prometheus+Targets",
      "https://placehold.co/800x500/0d1117/00ff41/png?text=Slack+Alert+Preview"
    ],
    tags: ["prometheus", "grafana", "kubernetes", "monitoring"],
    repoUrl: "https://github.com/ShanukaGallage/monitoring-stack",
    status: "in-progress",
  },
  {
    hash: "c4b7a9f",
    date: "2026-09-01",
    title: "Ansible Configuration Management",
    highlight: "Automated provisioning and hardening for Ubuntu server fleets.",
    description:
      "A suite of Ansible playbooks and roles for automated provisioning, configuration, and hardening of Ubuntu server fleets.",
    features: [
      "Automated package management and core user setup.",
      "Comprehensive SSH hardening and UFW firewall rules configuration.",
      "Automated Docker engine installation and service configuration.",
      "Molecule-tested roles to ensure complete idempotency and reliability."
    ],
    images: [
      "https://placehold.co/800x500/0d1117/00ff41/png?text=Ansible+Playbook+Run",
      "https://placehold.co/800x500/0d1117/00ff41/png?text=Molecule+Test+Suite",
      "https://placehold.co/800x500/0d1117/00ff41/png?text=Server+Security+Audit"
    ],
    tags: ["ansible", "linux", "security", "automation"],
    status: "planned",
  },
];

export interface RoadmapItem {
  date: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
}

export const roadmapItems: RoadmapItem[] = [
  {
    date: "2025 Q4",
    title: "Linux Fundamentals & Networking",
    description:
      "Mastered Linux administration, shell scripting, networking fundamentals, and system troubleshooting.",
    status: "completed",
  },
  {
    date: "2026 Q1",
    title: "Docker & Containerization",
    description:
      "Learned container fundamentals, multi-stage builds, Docker Compose orchestration, and container security best practices.",
    status: "completed",
  },
  {
    date: "2026 Q2",
    title: "CI/CD & GitHub Actions",
    description:
      "Built automated pipelines with GitHub Actions, integrated testing, scanning, and deployment workflows.",
    status: "completed",
  },
  {
    date: "2026 Q3",
    title: "Kubernetes & Helm",
    description:
      "Deploying and managing workloads on K8s clusters, writing Helm charts, configuring ingress and service mesh.",
    status: "in-progress",
  },
  {
    date: "2026 Q4",
    title: "Terraform & IaC Mastery",
    description:
      "Deep dive into Terraform modules, state management, multi-cloud provisioning, and policy as code with OPA.",
    status: "planned",
  },
  {
    date: "2027 Q1",
    title: "AWS Solutions Architect Certification",
    description:
      "Prepare for and obtain the AWS SAA-C03 certification. Hands-on labs with VPC, Lambda, ECS, and CloudFormation.",
    status: "planned",
  },
  {
    date: "2027 Q2",
    title: "CKA — Certified Kubernetes Administrator",
    description:
      "Earn the CKA certification. Focus on cluster administration, troubleshooting, networking, and security.",
    status: "planned",
  },
];
