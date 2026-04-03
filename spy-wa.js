```javascript
/**
 * ==========================================
 * TOOL NAME : SPY-WA-SENDER
 * BRAND     : SPY-E & 123Tool Official
 * FEATURES  : Bulk Sender & Auto-Reply
 * ==========================================
 */

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

// --- KONFIGURASI AUTO REPLY ---
const autoReplyConfig = {
    "halo": "Halo Bosku! Ada yang bisa SPY-E bantu?",
    "p": "Iya Bos, silakan langsung sampaikan pesannya.",
    "info": "Ini adalah layanan otomatis 123Tool Premium.",
    "harga": "Cek harga script terbaru di website resmi kita, Bos!"
};

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
});

// --- LOGIKA TAMPILAN QR ---
client.on("qr", (qr) => {
    console.log("\x1b[33m%s\x1b[0m", "[*] SCAN QR CODE DI BAWAH INI:");
    qrcode.generate(qr, { small: true });
});

// --- KETIKA WA AKTIF ---
client.on("ready", async () => {
    console.log("\x1b[32m%s\x1b[0m", ">>> NAGA-WA AKTIF & SIAP TEMPUR! <<<");
    
    // Tanya user mau Blast sekarang atau cuma Auto-Reply
    console.log("\x1b[36m%s\x1b[0m", "[!] Bot Standby untuk Auto-Reply...");
    console.log("[?] Jalankan fungsi Blast? (Edit file numbers.txt dulu)");
    
    // Jalankan Blast jika file tidak kosong
    startBlast();
});

// --- LOGIKA AUTO REPLY (Merespon Pesan Masuk) ---
client.on("message", async (msg) => {
    const chatMsg = msg.body.toLowerCase();
    
    if (autoReplyConfig[chatMsg]) {
        console.log(`\x1b[36m[*] Auto-Reply dikirim ke: ${msg.from}\x1b[0m`);
        await msg.reply(autoReplyConfig[chatMsg]);
    }
});

// --- LOGIKA BLAST SENDER ---
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function startBlast() {
    if (!fs.existsSync("numbers.txt")) {
        console.log("[!] File numbers.txt tidak ditemukan.");
        return;
    }

    const message = "Halo Bosku! Ini pesan otomatis dari SPY-WA Elite System.";
    const numbers = fs.readFileSync("numbers.txt", "utf-8").split("\n").map(n => n.trim());

    for (let number of numbers) {
        if (!number) continue;

        try {
            const formattedNum = number.includes("@c.us") ? number : `${number}@c.us`;
            const isRegistered = await client.isRegisteredUser(formattedNum);
            
            if (isRegistered) {
                await client.sendMessage(formattedNum, message);
                console.log(`\x1b[32m[SENT]\x1b[0m Terkirim ke: ${number}`);
            } else {
                console.log(`\x1b[31m[SKIP]\x1b[0m Nomor tidak ada WA: ${number}`);
            }

            // Jeda Manusia (5-12 detik) agar aman
            const delay = Math.floor(Math.random() * (12000 - 5000 + 1) + 5000);
            await sleep(delay);

        } catch (err) {
            console.log(`\x1b[31m[ERR]\x1b[0m Gagal kirim ke ${number}`);
        }
    }
    console.log("\x1b[32m%s\x1b[0m", "[+] Tugas Blast Selesai, Bosku!");
}

client.initialize();
