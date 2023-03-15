document.getElementById('PID','ejecucionTiempo','llegadaTiempo','inputTable').addEventListener('click', crearTabla);
document.getElementById('inputTable').addEventListener('click', getValorCelda);
//review addeventlistner click for button
document.getElementById('chartdiv').addEventListener('click', printGanttChart);
document.getElementById('statTable').addEventListener('change', printStat);
document.getElementById('wtOutput').addEventListener('change', printStat);
document.getElementById('taOutput').addEventListener('change', printStat);

function crearTabla()
{
    var procesoID=document.getElementById("PID").value;
    var ejecucionTiempo=document.getElementById("ejecucionTiempo").value;
    var llegadaTiempo=document.getElementById("llegadaTiempo").value;
    var prioridad=document.getElementById("prioridad").value;

    var table=document.getElementById("inputTable");
    var primeraCelda = table.insertRow(-1);
    var celda1 = primeraCelda.insertCell(0);
    var celda2 = primeraCelda.insertCell(1);
    var celda3 = primeraCelda.insertCell(2);
    var celda4 = primeraCelda.insertCell(3);

    celda1.innerHTML=procesoID;
    celda2.innerHTML=ejecucionTiempo;
    celda3.innerHTML=llegadaTiempo;
    celda4.innerHTML=prioridad;

    document.getElementById("PID").value = parseInt(procesoID) + 1;
    document.getElementById("ejecucionTiempo").value = "";
    document.getElementById("llegadaTiempo").value = "";
    document.getElementById("prioridad").value = "";
    // console.log(x);
}

function getValorCelda()
 {
        var pid =[];
    var tl =[];
    var ts =[];
    var pr =[];
    var bandera =[];

    // items es la lista ordenada
    var items = [];

    var table = document.getElementById('inputTable');
    for (var r = 1, n = table.rows.length; r < n; r++) {
        for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
        }
        pid.push(parseInt(table.rows[r].cells[0].innerHTML));
        ts.push(parseInt(table.rows[r].cells[1].innerHTML));
        tl.push(parseInt(table.rows[r].cells[2].innerHTML));
        pr.push(parseInt(table.rows[r].cells[3].innerHTML));
        bandera.push(0);
    }
    
    items = ordenarLista(pid,tl,ts,pr,bandera);
    
    return items;

}

function ordenarLista(pid,tl,ts,pr,bandera)
{
    var n = pid.length;
    var reloj = 0;
    var tot = 0;
    var items =[];
    var ct=[];
    var ta=[];
    var wt=[];
    var avgwt=0;
    var avgta=0;
    

    while(true)
    {
        //var min = 100;
        var pc = 0;
        var c = n; // c representa el PID presente
        if (tot == n)
            break;
        
        for (var i=0; i< n; i++)
        {
            if ((tl[i] <= reloj) && (bandera[i] == 0) && (pr[i] >= pc))
            {
                /*
                if (ts[i]<min)
                {
                    min=ts[i];
                    pc=pr[i];
                    c=i;       
                }
                */
                //min=ts[i];
                pc=pr[i];
                c=i;
            } 
        }
        if (c==n) 
            reloj++;
        else
        {
            var temp = [];
            temp.push(pid[c]);
            temp.push(ts[c]);
            items.push(temp);

            ct[c]=reloj+ts[c];
            ta[c]=ct[c]-tl[c];
            wt[c]=ta[c]-ts[c];
            
            reloj+=ts[c];
            bandera[c]=1;
            tot++;   
        }
    }


    for(i=0;i<n;i++)
    {
        avgwt +=wt[i];
        avgta +=ta[i];
    }

    avgwt/=n;
    avgta/=n;
    printStat(ct,ta,wt,avgwt,avgta,pid); 
    return items;
}

function generateGanttChartData(data)
{   
    var n = data.length;
    var finalData = [];
    var reloj = 0;
    
    //console.log(n);

    for (var i=0; i<n; i++)
    {
        var temp = {
                "category": "",
                "segments": [ {
                    "start": 0,
                    "duration": 0,
                    "color": "#727d6f",
                    "task": ""
                }, ]
            }

        temp.category = "Proceso " + (parseInt(data[i][0])).toString();
        temp.segments[0].start = reloj;
        temp.segments[0].duration = data[i][1];
        temp.segments[0].task = "Proceso " + (parseInt(data[i][0])).toString();

        reloj = reloj + data[i][1];
        finalData.push(temp);
    }
     
    return finalData;
}

function printGanttChart()
{
    var chartData = generateGanttChartData(getValorCelda());
    

    var chart = AmCharts.makeChart( "chartdiv", 
        {
        "type": "gantt",
        "theme": "dark",
        "marginRight": 70,
        "period": "hh:mm:ss",
        "dataDateFormat":"YYYY-MM-DD",
        "balloonDateFormat": "JJ:NN",
        "columnWidth": 0.5,
        "valueAxis": {
            "type": "timecode"
        },
        "brightnessStep": 10,
        "graph": {
            "fillAlphas": 1,
            "balloonText": "<b>[[task]]</b>: [[open]] [[value]]"
        },
        "rotate": true,
        "categoryField": "category",
        "segmentsField": "segments",
        "colorField": "color",
        "startDate": "00:00:00:00",
        "startField": "start",
        "endField": "end",
        "durationField": "duration",


        // This key contains values generated by generateGanttChartData FUNCTION
        "dataProvider": chartData,


        "valueScrollbar": {
            "autoGridCount":true
        },
        "chartCursor": {
            "cursorColor":"#55bb76",
            "valueBalloonsEnabled": false,
            "cursorAlpha": 0,
            "valueLineAlpha":0.5,
            "valueLineBalloonEnabled": true,
            "valueLineEnabled": true,
            "zoomable":false,
            "valueZoomable":true
        },
        "export": {
            "enabled": true
         }
    } );
}

function printStat(ct,ta,wt,avgwt,avgta,pid)
{
    console.log(ct);
    console.log(ta);
    console.log(wt);
    console.log(avgwt);
    console.log(avgta);
    
    document.getElementById("wtOutput").innerHTML=avgwt;
    document.getElementById("taOutput").innerHTML=avgta;
    
    var table_2=document.getElementById("statTable");

    console.log("len");
    console.log(table_2.rows.length);

    for(var i = table_2. rows. length; i > 1; i--)
    {
            console.log(i);
            table_2. deleteRow(i-1);
    }

    for (var i=0;i<pid.length;i++)
    {   
    var primeraCelda = table_2.insertRow(i+1);
    var celda1 = primeraCelda.insertCell(0);
    var celda2 = primeraCelda.insertCell(1);
    var celda3 = primeraCelda.insertCell(2);
    var celda4 = primeraCelda.insertCell(3);
        celda1.innerHTML=pid[i];
        celda2.innerHTML=ct[i];
        celda3.innerHTML=ta[i];
        celda4.innerHTML=wt[i];
    }
    
}