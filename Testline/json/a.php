<?php
$userInfo = $_POST;
//�ѻ�ȡ���û���Ϣ��������json�ַ���
$json = json_encode($userInfo);
//��json�ļ�,���û��json�ļ����Զ�����json�ļ�
$file = fopen('form.json','w+');
//��json�ַ���$jsonд��json�ļ�form.json
fwrite($file,$json);
//�ر��ļ�
fclose($file);
?>
