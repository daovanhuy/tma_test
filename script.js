document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const statusDiv = document.getElementById('status');
    const debugDiv = document.getElementById('debug');

    // More detailed debug info
    let initDataInfo = 'tg.initDataUnsafe is not available.';
    if (tg.initDataUnsafe) {
        initDataInfo = `User ID: ${tg.initDataUnsafe.user?.id}<br>
                        Username: ${tg.initDataUnsafe.user?.username || 'N/A'}<br>
                        Query ID: ${tg.initDataUnsafe.query_id || 'N/A (Not an inline app)'}<br>
                        Raw InitData: ${tg.initData || 'N/A'}`; // Show raw initData too
    }
    debugDiv.innerHTML = initDataInfo;
    console.log("Telegram.WebApp.initDataUnsafe:", tg.initDataUnsafe);
    console.log("Telegram.WebApp.initData:", tg.initData); // This is the one to validate on server if needed
    tg.MainButton.setText('Submit data').show().onClick(handleSubmit);

    function handleSubmit() {
        const data1 = input1.value.trim();
        const data2 = input2.value.trim();

        if (!data1 || !data2) {
            statusDiv.textContent = 'Please fill in both fields.';
            statusDiv.style.color = 'red';
            return;
        }

        const payload = {
            field1: data1,
            field2: data2,
            source: 'my_mini_app_form_v1.1' // Versioning can help
        };
        const dataString = JSON.stringify(payload);

        // CRUCIAL CHECK: Is user context available for sendData?
        //if (tg.initDataUnsafe?.user?.id) {
            statusDiv.textContent = 'Attempting to send data to bot...';
            statusDiv.style.color = 'blue';            
            console.log('Calling tg.sendData with:', dataString);
            //alert(`DEBUG: About to call tg.sendData(). User ID: ${tg.initDataUnsafe.user.id}. Data: ${dataString}`); // For explicit confirmation

            try {
                tg.sendData(dataString);
                // tg.sendData often closes the app. If you need to show a message *before* potential close:
                statusDiv.textContent = 'Data sent instruction issued. Waiting for bot confirmation.';
                statusDiv.style.color = 'green';
                // Note: The app might close before this message is visible for long.
                // The primary confirmation should come from the bot in the chat.
                tg.close();
            } catch (e) {
                console.error('Error calling tg.sendData:', e);
                statusDiv.textContent = `Error during tg.sendData: ${e.message}`;
                statusDiv.style.color = 'red';
                alert(`CRITICAL ERROR: tg.sendData failed: ${e.message}`);                
            }
        // } else {
        //     statusDiv.textContent = 'Error: Critical - Telegram user context (user.id) not found in initDataUnsafe. Cannot send data.';
        //     statusDiv.style.color = 'red';
        //     console.error('Telegram user data or ID is missing from initDataUnsafe.', tg.initDataUnsafe);
        //     alert('CRITICAL: Telegram user.id is missing from initDataUnsafe. Data NOT sent.');            
        // }
    }
    tg.expand();
});
