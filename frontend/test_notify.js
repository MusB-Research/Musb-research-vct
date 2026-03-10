// Using global fetch
async function testEmail() {
    const body = {
        type: "SCREENER_RESULT",
        studyTitle: "Test Study",
        status: "eligible",
        email: "test@example.com", // Replace with a real email to test if needed
        participantName: "Test User",
        answers: { age: 30, location: "New York" }
    };

    try {
        const response = await fetch("http://localhost:3000/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        console.log("Status:", response.status);
        console.log("Result:", result);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

testEmail();
