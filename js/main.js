document.addEventListener('DOMContentLoaded', function () {
  app.inicio();
});

var app = {
  
  //URL_SERVER: 'index.php?parada=',
  //URL_SERVER: 'http://transportesrober.com:9055/websae/Transportes/parada.aspx?idparada=',
  URL_SERVER: 'https://calcicolous-moonlig.000webhostapp.com/horarios/index.php?parada=',
  //URL_SERVER: 'https://calcicolous-moonlig.000webhostapp.com/horarios/index_mock.php?parada=',
  //URL_SERVER: 'https://horario-bus.herokuapp.com/?parada=',

  timeOuts: [],

  cargando: document.getElementById('cargando'),
  operacion: document.getElementById('operacion'),
  hora: document.getElementById('hora'),
  tablaResultado: document.getElementById('tablaResultado'),
  cabeceraTabla: document.getElementById('cabeceraTabla').classList, 
  posicionInicial: -1, 
  posicion: -1,
  
  inicio: function() {

    document.getElementById("parada").focus();
    document.addEventListener('keydown', app.manejarTeclado);
  },

  manejarTeclado: function(e) {
    if (e.key === "Enter") {
      app.mostrar();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      //app.moverFoco(1);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      //app.subirFoco();
    }

  },

  moverFoco: function(cambioPosicion) {
    app.posicion = app.posicion + cambioPosicion;
    if (document.getElementsByClassName('resultado')[app.posicion] !== undefined){
      document.getElementsByClassName('resultado')[app.posicion].scrollIntoView();
      document.getElementById("parada").blur();
      document.getElementsByClassName('resultado')[app.posicion].focus();
    } else {
      app.posicion = app.posicionInicial;
      document.documentElement.scrollTop = 0
      document.getElementById("parada").focus();
    }
  },

  subirFoco: function() {    
      app.posicion = app.posicionInicial;
      document.documentElement.scrollTop = 0
      document.getElementById("parada").focus();
  },

  mostrar: function() {
    app.posicion = app.posicionInicial;
    var numparada = document.getElementById("parada").value;
    if (numparada === "") {
      alert("Debes introducir un número de parada");      
      document.getElementById("parada").focus();
      return;
    }

    if(document.querySelector('.parada')) {
      document.querySelector('.parada').classList.toggle('disabled');
      document.querySelector('.parada').removeEventListener('click', app.mostrarFavorito);
    }

    app.cargando.classList.toggle('hide');

    var url = app.URL_SERVER + numparada;

    fetch(url)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);  
          app.fn_errorXHR();
          return;
        }

        // Examine the text in the response  
        response.json()
        .then(function(data) {
          app.renderResult(data, numparada);
        })
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
      app.fn_errorXHR();
    });
  },

  fn_errorXHR: function() {
    if(document.querySelector('.parada')) {
      document.querySelector('.parada').classList.toggle('disabled');
      document.querySelector('.parada').addEventListener('click', app.mostrarFavorito);
    }

    app.cargando.classList.toggle('hide');
  },

  renderResult: function(data, numparada) {

    if(document.querySelector('.parada')) {
      document.querySelector('.parada').classList.toggle('disabled');
      document.querySelector('.parada').addEventListener('click', app.mostrarFavorito);
    }

    app.cargando.classList.toggle('hide');

    if (data.hasOwnProperty("error")){
      app.operacion.textContent = data.error;
      return false;
    }

    if (data.length < 1) {
      app.operacion.textContent = "No hay bus acercandose";
      return false;
    }

    app.operacion.textContent = "";

    var fecha = new Date();

    app.hora.textContent = "Parada " + numparada + ", a las "+fecha.getHours()+":"+
        (fecha.getMinutes()<10?("0"+fecha.getMinutes()):fecha.getMinutes());

    //Remove content of tablaResultado
    //TODO crear function
    while(app.tablaResultado.firstChild) app.tablaResultado.removeChild(app.tablaResultado.firstChild);

    app.cabeceraTabla.remove('hide');
    document.getElementById('resultado').className = "";

    data.forEach(function(item) {
      var tr = (document.createElement('tr'));      
      tr.classList.add("resultado");
      for(var x in item){
        var td = (document.createElement('td'));
        td.textContent = item[x];
        tr.appendChild(td);
      }

      app.tablaResultado.appendChild(tr);
    });
  }
};
