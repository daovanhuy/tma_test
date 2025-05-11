document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready(); // Inform Telegram the app is ready

    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('status');
    const debugDiv = document.getElementById('debug');

    // Display user info for debugging (optional but good)
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        debugDiv.innerHTML = `User ID: ${tg.initDataUnsafe.user.id}<br>
                              Username: ${tg.initDataUnsafe.user.username || 'N/A'}<br>
                              First Name: ${tg.initDataUnsafe.user.first_name}`;
    } else {
        debugDiv.textContent = 'Telegram user data not available. Ensure you run this inside Telegram.';
    }

    // You can use Telegram's main button too. If so, configure it:
    // tg.MainButton.setText("Submit Data");
    // tg.MainButton.onClick(handleSubmit);
    // tg.MainButton.show();

    submitBtn.addEventListener('click', handleSubmit);

    function handleSubmit() {
        const data1 = input1.value.trim();
        const data2 = input2.value.trim();

        if (!data1 || !data2) {
            statusDiv.textContent = 'Please fill in both fields.';
            statusDiv.style.color = 'red';
            return;
        }

        // Construct the data payload
        // It's good practice to still include user info if available,
        // though the bot will also get it from the update context.
        const payload = {
            // telegram_id: tg.initDataUnsafe?.user?.id, // Optional: bot knows this
            // username: tg.initDataUnsafe?.user?.username, // Optional
            field1: data1,
            field2: data2,
            // You can add any other client-side specific info here
            source: 'my_mini_app_form_v1'
        };

        // Data sent via sendData must be a string.
        const dataString = JSON.stringify(payload);

        if (tg.initDataUnsafe?.user?.id) { // Check if user context is available
            statusDiv.textContent = 'Sending data to bot...';
            statusDiv.style.color = 'blue';
            submitBtn.disabled = true;
            // tg.MainButton.showProgress(); // If using MainButton

            // Send data to the bot
            tg.sendData(dataString);

            // IMPORTANT: tg.sendData() will often close the Mini App by default.
            // If it doesn't, or you want to give feedback *before* it potentially closes:
            // statusDiv.textContent = 'Data sent! The bot will process it.';
            // statusDiv.style.color = 'green';
            // setTimeout(() => {
            //     tg.close(); // Optionally close the app after a short delay
            // }, 1500);

        } else {
            statusDiv.textContent = 'Error: Cannot send data. Telegram user context not found.';
            statusDiv.style.color = 'red';
            // This case should ideally not happen if opened correctly via a bot button.
            alert('Error: Telegram user context not found. Please open via the bot.');
        }
    }

    // Expand the app to full height
    tg.expand();
});