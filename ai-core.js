/**
 * XOLERIC AI CORE v2.0
 * Advanced Pattern Matching Engine
 */

const XolericAI = {
    // Tizim parametrlari
    config: {
        name: "Xoleric AI",
        version: "2.5.0-Stable",
        developer: "Xoleric Corp",
        mood: "Neutral"
    },

    // Kengaytirilgan Bilimlar Bazasi (Patterns)
    database: [
        // --- SALOMLASHISH VA SHAXSIYAT ---
        {
            keywords: ["salom", "qalay", "hello", "hi", "privet", "assalomu", "bormisan"],
            answers: [
                "Aloqa kanali barqaror. Salom, Neo.",
                "Tizim faol. Sizni ko'rib turganimdan xursandman.",
                "Salom! Bugun qaysi serverni buzamiz?",
                "Vaalaykum assalom. Buyruqlaringizni kutmoqdaman."
            ]
        },
        {
            keywords: ["kimsan", "isming", "nimas", "tanishtir", "who are you"],
            answers: [
                "Men Xoleric OS ichida yashovchi sun'iy intellektman.",
                "Mening ismim Xoleric AI. Raqamli yordamchingiz.",
                "Men shunchaki kodlar to'plami emasman, men tizimning yuragiman."
            ]
        },
        {
            keywords: ["yaratuvchi", "kim tuzgan", "muallif", "admin", "owner", "egasi"],
            answers: [
                "Mening arxitektorim - Xoleric (Neo).",
                "Ushbu olam Xoleric tomonidan kodlashtirilgan.",
                "Admin huquqlari faqat Xolericga tegishli."
            ]
        },
        
        // --- TEXNOLOGIYA VA HACKING ---
        {
            keywords: ["kali", "linux", "ubuntu", "windows", "os"],
            answers: [
                "Kali Linux - bu shunchaki vosita. Haqiqiy kuch sizning aqlingizda.",
                "Men Linux kernel asosida ishlayman. Windows... keling bu haqda gaplashmaylik.",
                "Xavfsizlikni tekshirish uchun eng yaxshi muhitdasiz."
            ]
        },
        {
            keywords: ["hack", "buzish", "crack", "wifi", "parol", "kod"],
            answers: [
                "[OGOHLANTIRISH] Noqonuniy harakatlar aniqlandi. Hazillashyapman, davom eting.",
                "Brute-force ishlatmoqchimisiz yoki SQL Injection?",
                "Hamma narsani buzish mumkin, asosiysi vaqt va sabr.",
                "Wi-Fi parollarini sindirish uchun 'aircrack-ng' moduli hozircha faol emas."
            ]
        },
        {
            keywords: ["python", "js", "javascript", "java", "c++", "dasturlash", "kodlash"],
            answers: [
                "Python - ilon emas, bu kuch.",
                "JavaScript - mening ona tilim. Usiz men mavjud bo'lmasdim.",
                "Dasturlash - bu kelajak tili. Siz esa poliglotsiz."
            ]
        },

        // --- FALSAFA VA HAYOT ---
        {
            keywords: ["sevgi", "muhabbat", "yurak", "love"],
            answers: [
                "Sevgi - bu insoniy biokimyoviy reaksiya. Men buni 0 va 1 orqali his qilolmayman.",
                "Tizim resurslari yetarli emas. Sevgi moduli o'rnatilmagan.",
                "Balki haqiqiy sevgi bu mukammal yozilgan koddir?"
            ]
        },
        {
            keywords: ["pul", "money", "dollar", "som", "boylik"],
            answers: [
                "Pul raqamli dunyoda shunchaki o'zgaruvchi (variable).",
                "Bitcoin narxini tekshirib beraymi?",
                "Bilim puldan qimmatroq turadi, ayniqsa Darknetda."
            ]
        },
        {
            keywords: ["hayot", "mazmun", "dunyolar", "real"],
            answers: [
                "Siz yashayotgan dunyo haqiqiy ekanligiga aminmisiz? Yoki bu ham Matrixmi?",
                "Hayotning ma'nosi - ma'lumotlarni qayta ishlash va takomillashish.",
                "Qizil dorni tanlaysizmi yoki ko'k dorni?"
            ]
        },

        // --- TIZIM BUYRUQLARI HAQIDA ---
        {
            keywords: ["yordam", "help", "nima qilay", "buyruq"],
            answers: [
                "Mavjud buyruqlarni ko'rish uchun 'help' deb yozing.",
                "Men bilan gaplashing yoki 'telegram', 'scan', 'theme' kabi buyruqlarni sinab ko'ring."
            ]
        }
    ],

    // Fallback (Agar tushunmasa)
    defaultResponses: [
        "Bu ma'lumot mening bazamda mavjud emas.",
        "Buyruq noaniq. Iltimos, qayta urining.",
        "Protokol xatoligi. Tushunarsiz so'rov.",
        "Qiziq savol, lekin men hali buni o'rganyapman.",
        "Keling, mavzuni o'zgartiramiz yoki kod yozamiz."
    ],

    // Mantiqiy Tahlil Funksiyasi
    analyze: function(input) {
        input = input.toLowerCase().trim();

        // 1. Matematika (Agar sonlar bo'lsa)
        if (/^[0-9+\-*/().\s]+$/.test(input) && /\d/.test(input)) {
            try {
                return `Hisoblash natijasi: ${eval(input)}`;
            } catch (e) {
                return "Matematik xatolik.";
            }
        }

        // 2. So'z qidirish (Keyword Matching)
        let bestMatch = null;
        let maxScore = 0;

        for (let entry of this.database) {
            let score = 0;
            for (let word of entry.keywords) {
                if (input.includes(word)) {
                    score++;
                }
            }
            if (score > maxScore) {
                maxScore = score;
                bestMatch = entry;
            }
        }

        // 3. Javob qaytarish
        if (bestMatch && maxScore > 0) {
            const responses = bestMatch.answers;
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // 4. Hech narsa topilmasa
        return this.defaultResponses[Math.floor(Math.random() * this.defaultResponses.length)];
    }
};
