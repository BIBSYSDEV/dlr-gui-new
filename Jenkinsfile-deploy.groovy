pipeline {
    agent any
    tools {
        nodejs "node-12.13.1"
    }

    environment {
        LAST_COMMIT_MESSAGE = sh(returnStdout: true, script: 'git log -1')
        LAST_COMMIT = sh(returnStdout: true, script: 'git rev-parse --verify HEAD')
        LAST_COMMIT2 = "${LAST_COMMIT}".replaceAll("\n",'')
        AWS_BUILD_HOST = "ec2-54-194-199-152.eu-west-1.compute.amazonaws.com"
        SERVICE_NAME = "dlr-gui-new"
        VERSION = "${env.BRANCH_NAME}".replaceAll('/', '_').toLowerCase()

    }

    parameters {
        booleanParam(name: 'NPM_Install', defaultValue: true, description: 'npm install')
        booleanParam(name: 'DLR_dev', defaultValue: true, description: 'AWS Compile and upload')
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
                println("Running build #${env.BUILD_ID} of job ${env.JOB_NAME}, git branch: ${env.BRANCH_NAME}, release version: ${VERSION} - last commit ${LAST_COMMIT}")
            }
        }

        stage('AWS Compile and upload') {
            when {
                expression { return params.DLR_dev }
            }
            steps {
                sh 'npm run build'
                sh 'sed -i -- "s/%VERSION%/${LAST_COMMIT2}/g" build/index.html'
                sshagent(['ec2-user-aws-eu-west']) {
                    sh 'ssh  -o StrictHostKeyChecking=no -t ec2-user@${AWS_BUILD_HOST} "mkdir -p ~/${SERVICE_NAME}/"'
                    sh 'scp -p -r ./build ec2-user@${AWS_BUILD_HOST}:/home/ec2-user/${SERVICE_NAME}/'
                    sh 'ssh  -o StrictHostKeyChecking=no -t ec2-user@${AWS_BUILD_HOST} "PATH=~/.local/bin:$PATH && cd ~/${SERVICE_NAME}/ && aws s3 cp build s3://dlrdevnew.unit.no --recursive"'
                }
            }
        }

    }

}
