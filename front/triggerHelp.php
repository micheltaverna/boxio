<html>
<title>Aide sur les Déclencheurs</title>
</head>

<body>
<p><em>Les déclencheurs analyse en continue les trames qui circulent et si une trame conrespond à un <strong>&quot;Déclencheurs&quot;</strong> et que les <strong>&quot;Conditions&quot;</strong> sont valides
alors les <strong>&quot;Actions</strong>&quot; vont être exécutée. </em></p>
<p><em>La liste des paramètres possibles sont détaillés ci-dessous. </em></p>
<h3><u>Déclencheurs :</u></h3>
<table width="810" border="1">
  <tr>
    <th width="150">FONCTION</th>
    <th width="229">PARAMETRES</th>
    <th width="410">EXEMPLE</th>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>TRAME_ID</strong></td>
    <td valign="top"><strong>('id_legrand')</strong><br />
      =&gt; id_legrand : <em>id</em> ou <em>*</em> ou <em>id,id</em> ou <em>id-id</em></td>
    <td valign="top"><p><strong>TRAME_ID('113851,113851')</strong><br />
      =&gt; On détecte l'id 113851 ou 113851</p></td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>TRAME_UNIT</strong></td>
    <td valign="top"><strong>('unit_legrand')</strong><br />
      =&gt; unit_legrand : <em>unit</em> ou <em>*</em> ou <em>unit,unit</em> ou <em>unit-unit</em></td>
    <td valign="top"><p><strong>TRAME_UNIT('1-4')</strong><br />
      =&gt; On détecte les unites
    1,2,3 ou 4</p></td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>TRAME_VALUE</strong></td>
    <td valign="top"><p><strong>('valeur')</strong><br />
    =&gt; valeur : n'importe quelle <em>value</em> ou <em>value,value</em></p></td>
    <td valign="top"><strong>TRAME_VALUE('MOVE_UP,MOVE_DOWN')</strong><br />
    =&gt; On détecte le monter ou la descente d'un volet<br /></td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>TRAME_DIMENSION</strong></td>
    <td valign="top"><strong>('dimension')</strong><br />
      =&gt; dimension : n'importe quelle <em>dimension</em> ou <em>dimension,dimension</em></td>
    <td valign="top"><p><strong>TRAME_DIMENSION('DIM_STEP')</strong><br />
      =&gt; On détecte
    une variation sur un variateur</p></td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>AND</strong></td>
    <td valign="top">=&gt; Opérateur ET</td>
    <td valign="top"><strong>TRAME_ID('125231') AND TRAME_UNIT('4')</strong><br />
    =&gt; On détecte l'unité 4 de l'id 125231</td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>OR</strong></td>
    <td valign="top">=&gt; Opérateur OU</td>
    <td valign="top"><strong>TRAME_VALUE('ON,OFF,DIM_STOP') OR TRAME_DIMENSION('DIM_STEP,GO_TO_LEVEL_TIME')</strong><br />
    =&gt; On détecte un changement d'état d'un variateur</td>
  </tr>
</table>
<p>Exemple de déclencheur : (TRAME_ID('113851') AND TRAME_UNIT('1-3')) OR (TRAME_ID('124451') AND TRAME_UNIT('2')) AND TRAME_VALUE('ACTION')<br />
=&gt; Si l'on presse le bouton 1,2 ou 3 de l'interscenario 113851 OU le bouton 2 de l'interscenario 124451</p>
<h3><u>Conditions :</u></h3>
<table width="810" border="1">
  <tr>
    <th width="84">FONCTION</th>
    <th width="410">PARAMETRES</th>
    <th width="294">EXEMPLE</th>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>DATE</strong></td>
    <td valign="top"><strong>('minutes','heures','joursDuMois','joursDeLaSemaine','mois')<br>
    </strong>=&gt;identiques aux Jalons sélection des plages avec , - *</td>
    <td valign="top"><strong>DATE('*','8-10','*','1-5','*')<br>
      </strong>=&gt; Entre 8h et 10h du Lundi au Vendredi</td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>STATUS</strong></td>
    <td valign="top"><strong>('id_legrand','unit_legrand','status')<br>
    =&gt; </strong>id_legrand : <em>id</em> ou <em>*</em> ou <em>id,id</em> ou <em>id-id</em><br>
    =&gt; unit_legrand : <em>unit</em> ou <em>*</em> ou <em>unit,unit</em> ou <em>unit-unit</em><br>
    =&gt; status : n'importe quelle <em>status</em> ou <em>status,status </em>ou <em>status-status</em></td>
    <td valign="top"><strong>STATUS('113851','4','ON,50-100')<br>
      =&gt; </strong>Le variateur est sur ALLUME ou entre 50% et 100%</td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>!</strong></td>
    <td valign="top">=&gt; Inverse la condition</td>
    <td valign="top"><strong>!STATUS('113851','4','OFF')<br>
    </strong>=&gt; Le variateur n'est pas éteint</td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>AND</strong></td>
    <td valign="top">=&gt; Opérateur ET</td>
    <td valign="top">=&gt; Idem Déclencheurs</td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>OR</strong></td>
    <td valign="top">=&gt; Opérateur OU</td>
    <td valign="top">=&gt; Idem Déclencheurs</td>
  </tr>
</table>
<h3><u>Actions :</u></h3>
<table width="810" border="1">
  <tr>
    <th width="141">FONCTION</th>
    <th width="259">PARAMETRES</th>
    <th width="388">EXEMPLE</th>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>SEND_COMMAND</strong></td>
    <td valign="top"><p><strong>('type','command',delay)<br>
    =&gt; </strong>type : Le type de commande à appeller soit <em>'trame', 'favoris' ou 'macros'</em><br>
    =&gt; command : En fonction du type, soit une <em>trame IOBL</em>, soit 
    un <em>id</em><br>
    =&gt; delay : délai en secondes avant d'appeller l'url (paramètre facultatif)</p></td>
    <td valign="top"><strong>SEND_COMMAND('favoris','1',10)<br>
    =&gt; </strong>On lancera le favoris 1 et ceux 10 secondes apres le déclencheur</td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>SEND_MAIL</strong></td>
    <td valign="top"><strong>('email','subject','message')</strong><br>
      =&gt; email : adresse mail du destinataire<br>
      =&gt; subject : Objet du mail<br>
      =&gt; message : Contenue du mail <br></td>
    <td valign="top"><strong>SEND_MAIL('moi@provider.fr','BOXIO ALERTE','Détecteur Eau Garage Actif !')</strong><br>
      =&gt; Innondation dans le garage !
      <br>
    Dans la Beta 1.3 le systeme de mail n'est pas préconfiguré dans Boxio. Il faut donc utiliser cette fonction que si vous avez installé un mailer !</td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>SEND_URL</strong></td>
    <td valign="top"><strong>('url',delay)<br>
    =&gt; </strong>url : l'url complète du site à contacter<br>
    =&gt; delay : délai en secondes avant d'appeller l'url (paramètre facultatif)</td>
    <td valign="top"><strong>SEND_URL('http://monsite.fr/action.php?leave_house=1')<br>
      =&gt; 
    </strong>On appel un site pour prévenir d'un action</td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>AND</strong></td>
    <td valign="top">=&gt; Opérateur ET</td>
    <td valign="top">=&gt; Idem Déclencheurs</td>
  </tr>
  <tr>
    <td align="right" valign="top"><strong>OR</strong></td>
    <td valign="top">=&gt; Opérateur OU</td>
    <td valign="top">=&gt; Idem Déclencheurs</td>
  </tr>
</table>
<p>&nbsp;</p>
</body>
</html>
