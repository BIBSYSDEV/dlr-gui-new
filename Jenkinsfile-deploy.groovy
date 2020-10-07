pipeline {
    agent any
    tools {
        nodejs "node-12.13.1"
    }

    environment {
        LAST_COMMIT_MESSAGE = sh(returnStdout: true, script: 'git log -1')
        AWS_BUILD_HOST = "ec2-54-194-199-152.eu-west-1.compute.amazonaws.com"
        SERVICE_NAME = "dlr-gui-new"
        PCB = "PCB1"
    }

    parameters {
        booleanParam(name: 'NPM_Install', defaultValue: true, description: 'npm install')
        booleanParam(name: 'DLR_dev', defaultValue: false, description: 'AWS Compile and upload')
    }

    stages {
        stage('NPM Install') {
            when {
                expression { return params.NPM_Install }
            }
            steps {
                sh "node -v"
                sh "npm -v"
                sh 'npm install'
            }
        }

        stage('AWS Compile and upload') {
            when {
                expression { return params.DLR_dev }
            }
            steps {
                sh 'npm run build'
                sshagent(['ec2-user-aws-eu-west']) {
                    sh 'ssh -t ec2-user@${AWS_BUILD_HOST} "mkdir -p ~/${SERVICE_NAME}/"'
                    sh 'scp -p -r ./build ec2-user@${AWS_BUILD_HOST}:/home/ec2-user/${SERVICE_NAME}/'
                    sh 'ssh -t ec2-user@${AWS_BUILD_HOST} "PATH=~/.local/bin:$PATH && cd ~/${SERVICE_NAME}/ && aws s3 cp build s3://dlrdevnew.unit.no --recursive"'
                }
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
