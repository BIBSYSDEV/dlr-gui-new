pipeline {
    agent any
    tools {
        nodejs "node-12.13.1"
    }
    environment {
        LAST_COMMIT_MESSAGE = sh(returnStdout: true, script: 'git log -1')
        VERSION = "${env.BRANCH_NAME}".replaceAll('/', '_').toLowerCase()
    }
    stages {
        stage('NPM Install') {
            steps {
                sh "node -v"
                sh "npm -v"
                sh 'npm install'
            }
        }
        stage('Compile') {
            steps {
                sh 'npm run build'
            }
        }
    }

}
