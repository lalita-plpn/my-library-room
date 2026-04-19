// ฟังก์ชันสำหรับต้อนรับตามช่วงเวลา (ตัวอย่างลูกเล่นเล็กๆ)
document.addEventListener('DOMContentLoaded', () => {
    const hours = new Date().getHours();
    let greeting = "สวัสดีครับคุณหมอ";

    if (hours < 12) {
        greeting = "อรุณสวัสดิ์ครับคุณหมอ";
    } else if (hours < 18) {
        greeting = "สวัสดีตอนบ่ายครับคุณหมอ";
    } else {
        greeting = "สวัสดีตอนค่ำครับคุณหมอ";
    }

    console.log(greeting + " ยินดีต้อนรับสู่ My Library Room!");
    
    // ตรงนี้เราสามารถเพิ่มลูกเล่น เช่น กดปุ่มแล้วให้เปลี่ยนสี 
    // หรือนับจำนวนลิงก์ที่มีทั้งหมดได้ในอนาคตครับ
});

// ฟังก์ชันสำหรับแจ้งเตือนเมื่อกดลิงก์ (ตัวอย่าง)
function trackLinkClick(category) {
    console.log("คุณกำลังเปิดลิงก์ในหมวด: " + category);
}
