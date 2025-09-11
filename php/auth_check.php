<?php
// require this at top of protected pages
session_start();
if (empty($_SESSION['user'])) {
    // redirect to auth (signup/login) page
    header('Location: auth.html');
    exit;
}
