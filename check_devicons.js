const https = require('https');

const icons = [
  "linux/linux-original",
  "ubuntu/ubuntu-plain",
  "debian/debian-plain",
  "archlinux/archlinux-original",
  "bash/bash-original",
  "docker/docker-original",
  "kubernetes/kubernetes-plain",
  "helm/helm-original",
  "github/github-original",
  "gitlab/gitlab-original",
  "jenkins/jenkins-original",
  "argocd/argocd-original",
  "terraform/terraform-original",
  "ansible/ansible-original",
  "amazonwebservices/amazonwebservices-plain-wordmark",
  "googlecloud/googlecloud-original",
  "azure/azure-original",
  "prometheus/prometheus-original",
  "grafana/grafana-original"
];

let checked = 0;
for (const icon of icons) {
  const url = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}.svg`;
  https.get(url, (res) => {
    console.log(`${icon}: ${res.statusCode}`);
    checked++;
  });
}
