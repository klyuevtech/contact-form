<?php
sleep(1);
$data = json_decode(file_get_contents('php://input'), true);

$to = 'klyuevtech@gmail.com';

$fromEmail = (isset($data['email']) && isset($data['email']['value']))
	? $data['email']['value']
	: '';

$name = (isset($data['username']) && isset($data['username']['value']))
	? $data['username']['value']
	: '';
$subject = 'Contact form: client ' . ($name?$name.' ':'') . 'asks a question.';

$headers = '';
if ($fromEmail) {
	$headers .= "From: $fromEmail"       . "\r\n";
}
$headers .= 'Reply-To: ' . $fromEmail . "\r\n" .
			'X-Mailer: PHP/' . phpversion();

$message = '';
foreach($data as $field) {
	$message .= $field['label'] . ': ' . $field['value'] . "\n";
}

$result = mail($to, $subject, $message, $headers);

$errorMessage = !$result ? error_get_last()['message'] : '';

$return = array_merge([
	'result' => $result,
	'errorMessage' => $errorMessage
], $data);

print(json_encode($return));

exit;