function TrafficLayer(map) 
{
	this.map=map;
	this.blocks=[
	// 1. çevre yolu
	[40.984952041582275,28.783836364746094],[40.987284513400624,28.791046142578125],[40.99169006840385,28.79413604736328],[40.99765005663302,28.797740936279297],[40.999722969712465,28.804092407226562],[41.00024118779631,28.809242248535156],[40.99836262785708,28.81267547607422],[40.99557707836369,28.81490707397461],[40.9940223018812,28.817138671875],[40.992661842379256,28.82314682006836],[40.992467488730064,28.831815719604492],[40.99130135480306,28.84288787841797],[40.991430926257955,28.847951889038086],[40.99207877971284,28.85387420654297],[40.993957518731996,28.859539031982422],[40.995512296742355,28.866233825683594],[40.998297848973195,28.874130249023438],[41.0006946252774,28.88254165649414],[41.00386860029901,28.891725540161133],[41.00833781615294,28.898334503173828],[41.015008690362066,28.908977508544922],[41.02180840086087,28.91953468322754],[41.030420359792004,28.925199508666992],[41.03547045836749,28.9324951171875],[41.04052016955172,28.93970489501953],[41.047899819801714,28.945627212524414],[41.056055312534426,28.960647583007812],[41.063174360575715,28.968544006347656],[41.066927730193456,28.973779678344727],[41.06731599758193,28.98270606994629],[41.066927730193456,28.992919921875],[41.066345324812126,29.00167465209961],[41.06679830722118,29.009056091308594],[41.06498635886212,29.014720916748047],[41.06026211587454,29.016265869140625],[41.0575439044741,29.019269943237305],[41.053531101386724,29.025964736938477],[41.04925913879614,29.030771255493164],[41.04395116251321,29.036521911621094],[41.03825432142264,29.041929244995117],[41.032815967668625,29.045276641845703],[41.026600156101885,29.04587745666504],[41.02090181335136,29.0493106842041],[41.01591535898523,29.054718017578125],[41.012418139820994,29.05986785888672],[41.00840258516892,29.062442779541016],[41.005811774870615,29.070510864257812],[41.00736627327327,29.079437255859375],[41.00917980839489,29.087162017822266],[41.00814350872298,29.095916748046875],[41.00296176589039,29.103126525878906],[40.99726137817312,29.11102294921875],[40.99531795149639,29.12097930908203],[40.99674313666155,29.13677215576172],[40.99518838768076,29.147930145263672],[40.994151867988606,29.160118103027344],[40.99091263891055,29.176769256591797],[40.989746477482434,29.189300537109375],[40.98378577473523,29.202346801757812],[40.98093481339142,29.21710968017578],[40.97626933808981,29.233245849609375],
	
	[0,0],
	// 2. çevre yolu
	[41.10574311993223,28.582992553710938],[41.10134519447027,28.60565185546875],[41.09849932105248,28.619728088378906],[41.08918469136211,28.631744384765625],[41.08012753522192,28.64238739013672],[41.061491746033326,28.65509033203125],[41.05476085737835,28.66985321044922],[41.05527864249741,28.68907928466797],[41.05786750695986,28.69731903076172],[41.05760862509863,28.712425231933594],[41.054501963290505,28.718605041503906],[41.05631420050901,28.731307983398438],[41.062009478169955,28.741607666015625],[41.06045626953322,28.755340576171875],[41.06213891056728,28.765296936035156],[41.06188004551788,28.777313232421875],[41.06433922234842,28.791732788085938],[41.0607151401866,28.81216049194336],[41.06356265012584,28.831214904785156],[41.06136231236236,28.84185791015625],[41.065762914272426,28.85335922241211],[41.06835136607617,28.86211395263672],[41.07430441853401,28.870182037353516],[41.084009326420926,28.87584686279297],[41.08918469136211,28.88631820678711],[41.09099597279233,28.902454376220703],[41.09112534812663,28.910694122314453],[41.09371280131198,28.921852111816406],[41.09461838585146,28.92974853515625],[41.092160341629466,28.937816619873047],[41.09190159478235,28.945884704589844],[41.097593790014606,28.954639434814453],[41.09940483960651,28.963565826416016],[41.0997929151652,28.981590270996094],[41.101733258564074,28.99944305419922],[41.09849932105248,29.01111602783203],[41.094359648685455,29.023303985595703],[41.09203096833331,29.034805297851562],[41.090737221359454,29.04012680053711],[41.09086659720326,29.054546356201172],[41.09203096833331,29.082355499267578],[41.08996096094649,29.08956527709961],[41.08582075051623,29.092483520507812],[41.070939715985666,29.106216430664062],[41.05851470715536,29.118404388427734],[41.04090859282753,29.121150970458984],[41.029125400322236,29.121665954589844],[41.01759913903529,29.12097930908203],[41.00620040290916,29.12200927734375],[40.99687269742144,29.116859436035156],[40.99039434748888,29.110851287841797],[40.98534079261457,29.104156494140625],[40.98106440521699,29.096088409423828],

	[0,0],
	// mahmutbey bağlantı
	[40.989616902717245,28.81885528564453],[40.99382795224264,28.818769454956055],[40.99726137817312,28.820314407348633],[41.00108328349261,28.816967010498047],[41.00561745999186,28.814048767089844],[41.01326007992041,28.812503814697266],[41.02530512149984,28.811044692993164],[41.03178003982437,28.811302185058594],[41.04569895808175,28.808040618896484],[41.06136231236236,28.81216049194336],[41.072751500294565,28.81610870361328],[41.08180967289163,28.813018798828125],[41.092807204288924,28.813190460205078],[41.10923538033988,28.815250396728516],[41.1313487161958,28.805809020996094],

	[0,0],
	// alibeyköy bağlantı
	[41.00950364869991,28.950862884521484],[41.01462011427496,28.943309783935547],[41.01908860089484,28.936614990234375],[41.02375104635932,28.930091857910156],[41.02957863903372,28.92279624938965],[41.032815967668625,28.920564651489258],[41.03747744125065,28.91798973083496],[41.0401317439836,28.911123275756836],[41.04129701381102,28.902626037597656],[41.044210098119144,28.89352798461914],[41.04569895808175,28.882198333740234],[41.048417658920336,28.87558937072754],[41.05126570122526,28.870182037353516],[41.053531101386724,28.865718841552734],[41.0548255807411,28.855934143066406],[41.056702530560464,28.8486385345459],[41.06039155171068,28.84288787841797],[41.062009478169955,28.8405704498291],

	[0,0],
	// okmeydanı bağlantı 
	[41.056055312534426,28.960261344909668],[41.05751154413797,28.957343101501465],[41.05971201072913,28.957386016845703],[41.06213891056728,28.958072662353516],[41.0677689733042,28.957514762878418],[41.07087500847978,28.956913948059082],[41.07731309323384,28.95871639251709],[41.082391941284904,28.96094799041748],[41.086532367749484,28.961162567138672],[41.09002564966454,28.960647583007812],[41.094359648685455,28.963050842285156],[41.097658471217024,28.9654541015625],[41.099016761754854,28.967900276184082],[41.09969589649049,28.974123001098633],

	[0,0],
	// barbaros - büyükdere
	[41.042106216830774,29.00665283203125],[41.04427483186145,29.007210731506348],[41.04819110480741,29.007983207702637],[41.05031097350738,29.008476734161377],[41.05341783323132,29.00912046432495],[41.06084457513123,29.011030197143555],[41.064856932068864,29.01240348815918],[41.0687396250584,29.01437759399414],[41.07281620595359,29.01618003845215],[41.07773364969501,29.013090133666992],[41.08375054747408,29.00888442993164],[41.08918469136211,29.00639533996582],[41.09364811622433,29.00493621826172],[41.097787833430814,29.007339477539062],[41.1047730146343,29.01188850402832],[41.10684255527807,29.015836715698242],[41.10832999732831,29.020986557006836],[41.10839466795745,29.027767181396484],[41.1091707105388,29.032316207885742],[41.111304780342834,29.03763771057129],[41.11253345573342,29.04287338256836],[41.11136944804192,29.046993255615234],[41.11091677281061,29.051713943481445],[41.11188678734157,29.05463218688965],[41.11233945588468,29.05634880065918],


	[0,0],
	// şişhane - beyoğlu
	[41.02245595572735,28.96167755126953],[41.026470653787776,28.96871566772461],[41.02802466474813,28.971633911132812],[41.02993475297544,28.971612453460693],[41.03064697508069,28.972041606903076],[41.03103545661808,28.972814083099365],[41.03326918097483,28.974380493164062],[41.03479065996957,28.974251747131348],[41.035664685191776,28.97667646408081],[41.03605313712115,28.978779315948486],[41.0365225134775,28.98146152496338],[41.03710518291886,28.9833927154541],[41.03742888593546,28.984036445617676],

	[0,0],
	// beyoğlu - şişli
	[41.03951673214602,28.986074924468994],[41.04063345991062,28.986761569976807],[41.04252699846909,28.986353874206543],[41.04448521608413,28.986504077911377],[41.04781890707128,28.987362384796143],[41.051848240145816,28.9874267578125],[41.05440487774487,28.986997604370117],[41.058061667687156,28.98695468902588],[41.06120051991545,28.988027572631836],[41.06641003677588,28.995838165283203],

	[0,0],
	// boğaz bat sahili
	[41.01776103869501,28.971848487854004],[41.02174364502403,28.974552154541016],[41.02307112695306,28.97515296936035],[41.02556413045772,28.97819995880127],[41.02750666516963,28.983349800109863],[41.029060651680176,28.987598419189453],[41.03106782997607,28.989014625549316],[41.033431042113776,28.99193286895752],[41.035664685191776,28.993821144104004],[41.038027732319634,28.995537757873535],[41.03886934505601,28.99669647216797],[41.039581470504785,28.998541831970215],[41.04116754040456,29.002490043640137],[41.041620696212846,29.004764556884766],[41.042041480955334,29.006770849227905],[41.0423570677467,29.008229970932007],[41.04250272267847,29.00944232940674],[41.04357894079473,29.013261795043945],[41.04445284932442,29.015729427337646],[41.04495453231105,29.017252922058105],[41.04558567644249,29.01886224746704],[41.046637569876445,29.02167320251465],[41.048142557396,29.024956226348877],[41.04828819952275,29.025964736938477],[41.04867657695142,29.02714490890503],[41.049048769836105,29.02864694595337],[41.05000351586946,29.03160810470581],[41.05136279140356,29.033067226409912],[41.053919447867585,29.0338397026062],[41.05629802004045,29.034569263458252],[41.05775424627095,29.03510570526123],[41.0597929088332,29.03635025024414],[41.062721353202996,29.040555953979492],[41.0666041722851,29.042015075683594],[41.067639551987675,29.045448303222656],[41.07113383812124,29.045276641845703],[41.0754690831404,29.04364585876465],[41.07870415433591,29.04682159423828],[41.07993343964347,29.051027297973633],[41.08180967289163,29.05557632446289],[41.08407402099842,29.05686378479004],[41.08675878979851,29.056949615478516],[41.08921703611123,29.056949615478516],[41.091772220976644,29.055490493774414],[41.09445667524214,29.05330181121826],

	];

	this.path=new Array;
}
TrafficLayer.prototype.init=function()
{
	var i;
	var part;
	var partCoords;
	var r=124;
	var g;
	for(i=0; i<this.blocks.length-1; i++)
	{
		if(this.blocks[i][0]==0 || this.blocks[i+1][0]==0) continue;
		r+=Math.random()*120-60;
		if(r>255) r=255;
		if(r<0) r=0;
		g=255-r;
		//console.log(i, this.blocks[i]);
		partCoords=  [
		  {lat:this.blocks[i][0], lng:this.blocks[i][1]},
		  {lat:this.blocks[i+1][0], lng:this.blocks[i+1][1]}
		  ]
		 if(r>150)
		 {
			part = new google.maps.Polyline({
			  path:partCoords,
			  strokeColor: rgbToHex(r,0,0),
			  strokeOpacity: 1.0,
			  strokeWeight: 3
			});
			
			//part.setMap(this.map);
			
			this.path.push(part);
		 }
	}
	
}
TrafficLayer.prototype.show=function()
{
	var i;
	for(i=0; i<this.path.length;i++)
		this.path[i].setMap(this.map);
}
TrafficLayer.prototype.hide=function()
{
	var i;
	for(i=0; i<this.path.length;i++)
		this.path[i].setMap(null);
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}