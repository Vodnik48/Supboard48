<?php
header('Content-Type: application/json');

$gas_url = "https://script.google.com/macros/s/AKfycby6D-W_hceR0hgZTOJ7842LjPWTT8QYAYppl3s_cWtsix8qLSpB3q9t2d3YgPsHcX8T/exec";

// ==========================================
// TELEGRAM CONFIGURATION
// ==========================================
$telegram_bot_token = 'YOUR_BOT_TOKEN_HERE';
$telegram_chat_id = 'YOUR_CHAT_ID_HERE';
$enable_telegram = false; // Set to true after filling token and chat_id

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit;
}

// Ensure timestamp is added
$data['timestamp'] = date("d.m.Y H:i:s");
$json_data_updated = json_encode($data);

// ==========================================
// 1. Send Notification to Telegram
// ==========================================
if ($enable_telegram && !empty($telegram_bot_token) && !empty($telegram_chat_id)) {
    $message = "";

    if (isset($data['type']) && $data['type'] === 'feedback') {
        // Feedback Form
        $source = isset($data['source']) ? $data['source'] : 'Неизвестно';
        $name = isset($data['name']) ? $data['name'] : 'Не указано';
        $phoneObf = isset($data['phone_obf']) ? $data['phone_obf'] : '';
        $phone = $phoneObf ? base64_decode($phoneObf) : 'Не указан';
        $comment = isset($data['comment']) ? $data['comment'] : 'Нет комментария';

        $message .= "📬 <b>Новая заявка: {$source}</b>\n";
        $message .= "👤 Имя: {$name}\n";
        $message .= "📞 Телефон: {$phone}\n";
        $message .= "💬 Комментарий:\n{$comment}";

    } else {
        // Booking Form
        $name = isset($data['bookingName']) ? $data['bookingName'] : 'Не указано';
        $phoneObf = isset($data['bookingPhone_obf']) ? $data['bookingPhone_obf'] : '';
        $phone = $phoneObf ? base64_decode($phoneObf) : 'Не указан';
        $date = isset($data['bookingDate']) ? $data['bookingDate'] : '';
        $endDate = isset($data['bookingEndDate']) ? $data['bookingEndDate'] : '';
        $time = isset($data['bookingTime']) ? $data['bookingTime'] : '';

        $message .= "🏄 <b>Новое бронирование</b>\n";
        $message .= "👤 Имя: {$name}\n";
        $message .= "📞 Телефон: {$phone}\n";
        $message .= "📅 Дата: {$date}";
        if ($endDate && $endDate !== $date) {
            $message .= " - {$endDate}";
        }
        $message .= "\n⏰ Время: {$time}\n\n";

        if (isset($data['items']) && is_array($data['items'])) {
            $message .= "📦 <b>Оборудование:</b>\n";
            $total = 0;
            foreach ($data['items'] as $item) {
                $message .= "- {$item['name']} (x{$item['qty']}): {$item['duration']} - {$item['subtotal']} ₽\n";
                $total += $item['subtotal'];
            }
            $message .= "\n💰 <b>Итого: {$total} ₽</b>";
        }
    }

    $telegram_url = "https://api.telegram.org/bot{$telegram_bot_token}/sendMessage";
    $telegram_params = [
        'chat_id' => $telegram_chat_id,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];

    $ch_tg = curl_init($telegram_url);
    curl_setopt($ch_tg, CURLOPT_POST, 1);
    curl_setopt($ch_tg, CURLOPT_POSTFIELDS, http_build_query($telegram_params));
    curl_setopt($ch_tg, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch_tg, CURLOPT_SSL_VERIFYPEER, false);
    @curl_exec($ch_tg);
    @curl_close($ch_tg);
}

// ==========================================
// 2. Forward to Google Apps Script
// ==========================================
// Note: We send the $json_data_updated which contains the obfuscated phone 
// and the new timestamp. Google Sheets will store the Base64 phone number.
$ch = curl_init($gas_url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data_updated);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
curl_close($ch);

echo json_encode(["status" => "success"]);
?>