const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function check() {
    try {
        await ssh.connect({
            host: '157.173.101.159',
            username: 'user265',
            password: '!MZ2Q9@R'
        });

        console.log("--- LS -R /home/user265/EdgeWalletNew ---");
        const lsResult = await ssh.execCommand('ls -R /home/user265/EdgeWalletNew');
        console.log(lsResult.stdout || "Directory /home/user265/EdgeWalletNew NOT FOUND");

        console.log("\n--- NODE VERSION ---");
        const nodeV = await ssh.execCommand('node -v');
        console.log(nodeV.stdout || "Node NOT found");

        console.log("\n--- PM2 VERSION ---");
        const pm2V = await ssh.execCommand('pm2 -v');
        console.log(pm2V.stdout || "PM2 NOT found");

        console.log("\n--- ATTEMPT MANUAL START ---");
        const startResult = await ssh.execCommand('cd /home/user265/EdgeWalletNew/backend && node server.js', {
            // We only run it for a few seconds to see if it starts
            onStdout: (chunk) => console.log('STDOUT:', chunk.toString()),
            onStderr: (chunk) => console.log('STDERR:', chunk.toString())
        });

        // Wait 5 seconds then kill it if it hungs
        setTimeout(() => {
            ssh.dispose();
            process.exit(0);
        }, 5000);

    } catch (err) {
        console.error("Check failed:", err);
        ssh.dispose();
        process.exit(1);
    }
}

check();
