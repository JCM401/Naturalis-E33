<?php
$conn = new mysqli("localhost", "root", "", "naturalis");

if ($conn->connect_error) {
    die("Error de conexión");
}

$sql = "SELECT * FROM compras ORDER BY fecha DESC";
$resultado = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Compras Registradas - Naturalis</title>

<style>
body{
    font-family: Arial;
    background:#0f2f1c;
    color:#eafff2;
    padding:40px;
}

h2{
    text-align:center;
    color:#7dffb3;
}

.btn-volver{
    background:#7dffb3;
    color:#103020;
    padding:10px 18px;
    border-radius:20px;
    text-decoration:none;
    font-weight:bold;
}

table{
    width:100%;
    margin-top:30px;
    border-collapse:collapse;
    background:#143828;
}

th, td{
    padding:12px;
    text-align:center;
    border-bottom:1px solid #2e6b4f;
}

th{
    background:#1f5a40;
    color:#b8ffd9;
}
</style>
</head>

<body>

<a href="admin.html" class="btn-volver">⬅ Volver al panel</a>

<h2>📊 Registro de Compras</h2>

<table>
<tr>
    <th>Usuario</th>
    <th>Total</th>
    <th>Método de Pago</th>
    <th>Fecha</th>
</tr>

<?php
if ($resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()){
        echo "<tr>";
        echo "<td>".$fila["usuario"]."</td>";
        echo "<td>$".$fila["total"]."</td>";
        echo "<td>".$fila["metodo"]."</td>";
        echo "<td>".$fila["fecha"]."</td>";
        echo "</tr>";
    }
} else {
    echo "<tr><td colspan='4'>No hay compras registradas</td></tr>";
}
?>

</table>

</body>
</html>

<?php $conn->close(); ?>
