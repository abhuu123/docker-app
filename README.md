🚀 CI/CD Pipeline for Dockerized Application

This project demonstrates a complete CI/CD pipeline using Jenkins, GitHub, and Docker.
It automates the process of cloning code, building Docker images, pushing them to DockerHub, and deploying with Docker Compose.
----
📌 Pipeline Workflow

The Jenkins pipeline (Jenkinsfile) defines the following stages:

1️⃣ Code (Clone Repository)

Pulls the latest code from the GitHub repository.

Ensures we always work with the most recent version of the project.

stage('code') {
    steps {
        echo 'Cloning code'
        git url:"https://github.com/abhuu123/docker-app.git", branch:"main"
        echo "Code clone successful"
    }
}

2️⃣ Build (Docker Images)

Builds frontend and backend Docker images.

Tags them with latest for easy deployment.

stage('build') {
    steps {
        sh 'docker build -t abhu1234/back:latest ./backend'
        sh 'docker build -t abhu1234/front:latest ./frontend'
    }
}

3️⃣ Push (DockerHub)

Logs in to DockerHub.

Pushes both images to the DockerHub registry.

stage('push') {
    steps {
        sh 'docker login -u abhu1234 -p <your-password>'
        sh 'docker push abhu1234/front:latest'
        sh 'docker push abhu1234/back:latest'
    }
}

4️⃣ Deploy (Docker Compose)

Stops running containers (if any).

Deploys updated containers using docker-compose.

stage('deploy') {
    steps {
        sh 'docker-compose down || true'
        sh 'docker-compose up -d'
    }
}

⚙️ Tech Stack

Jenkins – Automation server for CI/CD

Docker – Containerization

DockerHub – Image registry

Docker Compose – Multi-container orchestration

GitHub – Code repository

🔑 How to Run

Clone this repository:

git clone https://github.com/abhuu123/docker-app.git


Configure Jenkins with this repository.

Run the pipeline to:

Build & push images

Deploy containers

📸 Pipeline Flow Diagram
flowchart TD
    A[GitHub Commit] --> B[Jenkins: Code Stage]
    B --> C[Build Docker Images]
    C --> D[Push to DockerHub]
    D --> E[Deploy with Docker Compose]
    E --> F[Running Containers]


🔥 With this setup, every code change triggers an automated build → push → deploy pipeline.
