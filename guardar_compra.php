<?php
header("Content-Type: application/json");

// 1. Conexión
$conn = new mysqli("localhost", "root", "", "naturalis");

if ($conn->connect_error) {
    echo json_encode(["status"=>"error","msg"=>"Error conexión BD"]);
    exit;
}

// 2. Leer JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status"=>"error","msg"=>"JSON vacío"]);
    exit;
}

$usuario = $data["usuario"] ?? "";
$total   = $data["total"] ?? 0;
$metodo  = $data["metodo"] ?? "";

// 3. Validación
if ($usuario=="" || $total==0 || $metodo=="") {
    echo json_encode(["status"=>"error","msg"=>"Datos incompletos"]);
    exit;
}

// 4. Insertar
$stmt = $conn->prepare(
    "INSERT INTO compras (usuario, total, metodo) VALUES (?, ?, ?)"
);

$stmt->bind_param("sds", $usuario, $total, $metodo);

if ($stmt->execute()) {
    echo json_encode(["status"=>"ok"]);
} else {
    echo json_encode([
        "status"=>"error",
        "msg"=>$stmt->error
    ]);
}

$stmt->close();
$conn->close();
