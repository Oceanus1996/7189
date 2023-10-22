<?php
session_start();

$action = $_POST['action'];

switch ($action) {
    case 'store':
        $username = $_POST['username'];
        $storeData = $_POST['storeData'];

        // Store the data in the session
        $_SESSION["storeData"] = $storeData;
        $_SESSION["username"] = $username;
        echo "Data stored successfully in session.";
        break;

    case 'fetch_urls':
        if (isset($_SESSION["storeData"])) {
            echo $_SESSION["storeData"];
            
        } else {
            echo json_encode([]); // Return empty array if session data is not set
        }
        break;
    default:
        echo json_encode(array("error" => "Invalid action."));
}

?>


