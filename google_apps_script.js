/**
 * Google Apps Script Webhook for Sapboard48
 * 
 * 1. Open Google Sheets.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code.
 * 4. Create a sheet named "Заявки".
 * 5. Add headers in Row 1 (A-H):
 *    A: Время заявки | B: Имя клиента | C: Телефон | D: Дата проката | E: Дата возврата | F: Время начала | G: Оборудование | H: Предв. сумма
 * 6. Click Deploy > New Deployment.
 * 7. Choose type: Web app.
 * 8. Execute as: Me. Who has access: Anyone.
 * 9. Copy the Web app URL and paste it into `$GOOGLE_SHEETS_URL` in `booking_handler.php`.
 */

function doPost(e) {
    try {
        if (typeof e !== 'undefined' && e.postData && e.postData.contents) {
            var payload = JSON.parse(e.postData.contents);
            var timestamp = payload.timestamp || new Date().toLocaleString("ru-RU");
            var type = payload.type || "booking";

            // Helper to decode Base64 obfuscated phone
            function decodePhone(encodedStr) {
                if (!encodedStr) return "";
                try {
                    // payload is btoa(unescape(encodeURIComponent(str))) in JS
                    // So we reverse it. GAS Uses Utilities.base64Decode
                    var decodedBytes = Utilities.base64Decode(encodedStr);
                    var decodedStr = Utilities.newBlob(decodedBytes).getDataAsString('UTF-8');
                    return decodeURIComponent(escape(decodedStr));
                } catch (ex) {
                    return "Error decoding data";
                }
            }

            if (type === 'feedback') {
                var sheetName = "Обратная связь";
                var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

                if (!sheet) {
                    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
                    sheet.appendRow([
                        "Время заявки",
                        "Источник",
                        "Имя клиента",
                        "Телефон",
                        "Комментарий",
                        "Согласие"
                    ]);
                    sheet.getRange("A1:F1").setFontWeight("bold").setBackground("#dbeafe"); // light blue
                }

                var source = payload.source || "";
                var name = payload.name || "";
                var phone = payload.phone_obf ? decodePhone(payload.phone_obf) : (payload.phone || "");
                var comment = payload.comment || "";
                var consentStr = payload.consent ? "Да" : "Нет";

                sheet.appendRow([
                    timestamp,
                    source,
                    name,
                    phone,
                    comment,
                    consentStr
                ]);

            } else {
                // Booking type
                var sheetName = "Заявки";
                var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

                if (!sheet) {
                    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
                    sheet.appendRow([
                        "Время заявки",
                        "Имя клиента",
                        "Телефон",
                        "Дата проката",
                        "Дата возврата",
                        "Время начала",
                        "Оборудование",
                        "Предв. сумма (₽)"
                    ]);
                    sheet.getRange("A1:H1").setFontWeight("bold").setBackground("#f3f4f6");
                }

                var name = payload.bookingName || "";
                var phone = payload.bookingPhone_obf ? decodePhone(payload.bookingPhone_obf) : (payload.bookingPhone || "");
                var startDate = payload.bookingDate || "";
                var endDate = payload.bookingEndDate || "";
                var startTime = payload.bookingTime || "";
                var total = 0;

                // Construct equipment string from array
                var equipmentStr = "";
                if (payload.items && Array.isArray(payload.items)) {
                    for (var i = 0; i < payload.items.length; i++) {
                        var itm = payload.items[i];
                        equipmentStr += "- " + itm.name + " (x" + itm.qty + ") | " + itm.duration + " | " + itm.subtotal + " ₽\n";
                        total += (itm.subtotal || 0);
                    }
                } else {
                    equipmentStr = payload.bookingEquipment || "";
                    total = payload.bookingTotal || 0;
                }

                sheet.appendRow([
                    timestamp,
                    name,
                    phone,
                    startDate,
                    endDate,
                    startTime,
                    equipmentStr,
                    total
                ]);

                var lastRow = sheet.getLastRow();
                sheet.getRange(lastRow, 8).setNumberFormat("#,##0 ₽");
            }

            return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Row added successfully" }))
                .setMimeType(ContentService.MimeType.JSON);

        } else {
            return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "No POST data received" }))
                .setMimeType(ContentService.MimeType.JSON);
        }

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Handle GET requests (e.g., if someone visits the URL directly)
function doGet(e) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "ok", "message": "Webhook is active. Send POST requests to this URL." }))
        .setMimeType(ContentService.MimeType.JSON);
}
