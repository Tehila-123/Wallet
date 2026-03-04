const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function forceRepair() {
    try {
        await ssh.connect({
            host: '157.173.101.159',
            username: 'user265',
            password: '!MZ2Q9@R'
        });

        const projectDir = '/home/user265/EdgeWalletNew';
        const password = '!MZ2Q9@R';

        console.log("--- FORCE CLEANING SESSIONS ---");
        await ssh.execCommand('pkill -9 node || true');
        await ssh.execCommand('pkill -9 npm || true');

        console.log("--- FORCE REMOVING NODE_MODULES WITH SUDO ---");
        // Use echo to pass password to sudo -S
        await ssh.execCommand(`echo "${password}" | sudo -S rm -rf ${projectDir}/backend/node_modules ${projectDir}/frontend/node_modules`);
        await ssh.execCommand(`echo "${password}" | sudo -S rm -rf ${projectDir}/backend/package-lock.json ${projectDir}/frontend/package-lock.json`);

        console.log("--- INSTALLING FRESH ---");
        await ssh.execCommand('cd ' + projectDir + '/backend && npm install', {
            onStdout: (chunk) => process.stdout.write(chunk.toString()),
            onStderr: (chunk) => process.stderr.write(chunk.toString())
        });
        await ssh.execCommand('cd ' + projectDir + '/frontend && npm install', {
            onStdout: (chunk) => process.stdout.write(chunk.toString()),
            onStderr: (chunk) => process.stderr.write(chunk.toString())
        });

        console.log("\n--- STARTING WITH PM2 ---");
        await ssh.execCommand('pm2 delete all || true');
        await ssh.execCommand('cd ' + projectDir + ' && pm2 start backend/server.js --name edgewallet-backend');
        await ssh.execCommand('cd ' + projectDir + ' && pm2 start frontend/server.js --name edgewallet-frontend');
        await ssh.execCommand('pm2 save');

        const pm2Result = await ssh.execCommand('pm2 list');
        console.log(pm2Result.stdout);

    } catch (err) {
        console.error("Force repair failed:", err);
    } finally {
        ssh.dispose();
    }
}

forceRepair();
