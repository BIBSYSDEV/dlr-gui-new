pipeline {
    agent any
    tools {
        nodejs "nodejs10110"
    }
    environment {
        LAST_COMMIT_MESSAGE = sh(returnStdout: true, script: 'git log -1')
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
                sh 'npm build'
            }
        }

    }
    post {
        success {
            script {
                def previousResult = currentBuild.previousBuild?.result
                if (previousResult && previousResult != currentBuild.currentResult) {
                    emailext(
                            subject: "${currentBuild.fullDisplayName} - Back to normal",
                            body: "Open: ${env.BUILD_URL}",
                            attachlog: true,
                            compresslog: true,
                            recipientProviders: [[$class: 'CulpritsRecipientProvider']]
                    )
                }
            }
        }
        failure {
            script {
                def message = "${currentBuild.fullDisplayName} - Failure after ${currentBuild.durationString.replaceFirst(" and counting", "")}"
                emailext(
                        subject: "FAILURE: ${currentBuild.fullDisplayName}",
                        body: "${message}\n\nLast comit message:\n${LAST_COMMIT_MESSAGE}\nOpen: ${env.BUILD_URL}",
                        attachlog: true,
                        compresslog: true,
                        recipientProviders: [[$class: 'CulpritsRecipientProvider']]
                )

            }
        }
    }

}
