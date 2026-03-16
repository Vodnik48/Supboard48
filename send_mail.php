<?php
// send_mail.php

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form fields and sanitize input
    $name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
    $phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : '';
    
    // Simulate data processing (e.g., sending email or saving to database)
    // In a real scenario, you would use mail() function or a library like PHPMailer
    
    // Validate inputs again on server side
    if (empty($name) || empty($phone)) {
        // Handle error - redirect back with error or show message
        echo "Ошибка: Заполните все обязательные поля.";
        exit;
    }

    // Log the application (simulated storage)
    $logEntry = date('Y-m-d H:i:s') . " | Имя: $name | Телефон: $phone\n";
    file_put_contents('applications.log', $logEntry, FILE_APPEND);

    // Success response
    // For a better UX, you might want to redirect back to the site with a success parameter
    header("Location: index.html?status=success");
    exit;
} else {
    // If accessed directly without POST data
    header("Location: index.html");
    exit;
}
?>
