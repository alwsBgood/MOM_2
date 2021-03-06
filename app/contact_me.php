<?php
$recipient_email    = "hello@hirehunt.io";
$from_email         = "hello@moveonmiles.com";


if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
	die('Sorry Request must be Ajax POST'); //exit script
}

if($_POST){

    $sender_name 	= filter_var($_POST["entry_1750371417"], FILTER_SANITIZE_STRING); //capture sender name
    $sender_email 	= filter_var($_POST["email"], FILTER_SANITIZE_STRING); //capture sender email
    $country_code   = filter_var($_POST["entry_522199749"], FILTER_SANITIZE_NUMBER_INT);
    $phone_number   = filter_var($_POST["phone2"], FILTER_SANITIZE_NUMBER_INT);
    $subject        = filter_var($_POST["subject"], FILTER_SANITIZE_STRING);
    $message 		=  $sender_name . ' ' . $country_code;

    $attachments = $_FILES['file_attach'];


    $file_count = count($attachments['name']); //count total files attached
    $boundary = md5("sanwebe.com");

    if($file_count > 0){ //if attachment exists
        //header
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "From:".$from_email."\r\n";
        $headers .= "Reply-To: ".$sender_email."" . "\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary = $boundary\r\n\r\n";

        //message text
        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/plain; charset=ISO-8859-1\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($message));

        //attachments
        for ($x = 0; $x < $file_count; $x++){
            if(!empty($attachments['name'][$x])){

                if($attachments['error'][$x]>0)
                {
                    $mymsg = array(
                    1=>"The uploaded file exceeds the upload_max_filesize directive in php.ini",
                    2=>"The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form",
                    3=>"The uploaded file was only partially uploaded",
                    4=>"No file was uploaded",
                    6=>"Missing a temporary folder" );
                    print  json_encode( array('type'=>'error',$mymsg[$attachments['error'][$x]]) );
					exit;
                }

                //get file info
                $file_name = $attachments['name'][$x];
                $file_size = $attachments['size'][$x];
                $file_type = $attachments['type'][$x];

                //read file
                $handle = fopen($attachments['tmp_name'][$x], "r");
                $content = fread($handle, $file_size);
                fclose($handle);
                $encoded_content = chunk_split(base64_encode($content));

                $body .= "--$boundary\r\n";
                $body .="Content-Type: $file_type; name=".$file_name."\r\n";
                $body .="Content-Disposition: attachment; filename=".$file_name."\r\n";
                $body .="Content-Transfer-Encoding: base64\r\n";
                $body .="X-Attachment-Id: ".rand(1000,99999)."\r\n\r\n";
                $body .= $encoded_content;
            }
        }

    }else{
       $headers = "From:".$from_email."\r\n".
        "Reply-To: ".$sender_email. "\n" .
        "X-Mailer: PHP/" . phpversion();
        $body = $message;
    }

    $sentMail = mail($recipient_email, $subject, $body, $headers);
    if($sentMail) //output success or failure messages
    {
        print json_encode(array('type'=>'done', 'text' => 'Thank you for your email'));
		exit;
    }else{
        print json_encode(array('type'=>'error', 'text' => 'Could not send mail! Please check your PHP mail configuration.'));
		exit;
    }
}
?>