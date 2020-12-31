/* Basado en una libreria de Jim Camut */
/* https://github.com/jimcamut/calendarize */

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septimbre", "Octubre", "Noviembre", "Diciembre"];
const dayNames = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const catNode = document.getElementById('categorias');
const selCatNode = document.getElementById('selCat');
const regEx = /^$|\s+/;
const db = firebase.firestore();
let numDia = 0;
let catSeleccionada = " ";
let anioFB = [];
let categoria = [];


// Devuele la cantidad de dias en el año actual
const daysInYear = anio => {
    esBisiesto = new Date(new Date().getFullYear(), 1, 29).getDate() === 29;  
    return esBisiesto ? 366 : 365;
};

const cargaAnio = () => {
    var docRef = db.collection("calendario").doc("anio");
    docRef.get().then(function(doc) {
    anioFB = doc.data().anioFB;						// Fetch del array completo                                                         
    if ( anioFB.length != daysInYear()){            // Incializa el año poniendo todos sus dias en " "
        anioFB = [];
        for (let i = 0; i < daysInYear(); i++){
            anioFB.push(" ");
        };
        console.log("Inicializando base de datos");
        salvaAnio(anioFB);
    } else {
        categorias = [...new Set(anioFB)];			    // Filtra solo valores unicos de categorias incluida " "
        categorias.splice(categorias.indexOf(" "),1);	// Saco el " " del array
        dibujaCategorias();
    };
    }).catch(function(error) {
        console.log("Error al obtener el documento:", error);
    });
};

const salvaAnio = (anioFB) => db.collection("calendario").doc("anio").set({anioFB});

function dibujaCategorias() {
    while (selCat.firstChild) {selCat.removeChild(selCat.firstChild)};
    let tituloCategorias = document.createElement("h4");
    tituloCategorias.innerText = "Seleccione una categoria: ";
    tituloCategorias.classList.add ("titulo");
    selCatNode.appendChild(tituloCategorias);
    for (let i = 0; i < categorias.length ; i++){
        if (categorias[i] != " "){
            let buttonCat = document.createElement('button');
            buttonCat.classList.add("buttonCat");
            buttonCat.type = "submit";
            buttonCat.name = categorias[i];
            buttonCat.innerText = categorias[i];
            selCatNode.appendChild(buttonCat);
        };
    };
    catNode.addEventListener("click", catClickHandler);						
};

// Categorias ClickHandler
function catClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    let nameCat = e.target.getAttribute("name");
    let buttonNodes = document.getElementsByClassName("buttonCat");
    let inputCatValue = document.getElementById("addCatValue").value
    let calendario = document.getElementById("calendario");
    let daysColl = calendario.getElementsByClassName("day"); // Colleccion de todos los dias

    if (!nameCat) {return};
    
    if (nameCat == "addCat"){
        if (regEx.test(inputCatValue)){
            alert("La categoria no puede contener espacios o estar vacia");
            return;
        }else {
            categorias.push(inputCatValue);
            nameCat = inputCatValue;
            dibujaCategorias();
            return;
        };
    };

    if (nameCat == "delCat"){
        categorias.splice(categorias.indexOf(inputCatValue),1);	// Borro la categoria del array de categorias
        dibujaCategorias();
        for (let h = 0; h < daysColl.length; h++){
            let dayCatValue = daysColl[h].getAttribute("categoria");

            if (dayCatValue == inputCatValue) {
                daysColl[h].removeAttribute("categoria");
                daysColl[h].setAttribute("categoria"," ");
                daysColl[h].classList.remove("seleccionado");
                anioFB[h] = " ";                
            }						
        }
        salvaAnio(anioFB);
    };

        // Manejo de clase "seleccionado" para los botones de categorias
        for (i = 0; i < categorias.length; i++){
            let buttonOff = buttonNodes[i];

            if (e.target.id == "categorias" ) {return;};

            if (nameCat == categorias[i]) {
                e.target.classList.add('seleccionado');
                catSeleccionada = categorias[i];
                inputCatRef = document.getElementById("addCatValue");						
                inputCatRef.value = nameCat;
            } else {
                    buttonOff.classList.remove('seleccionado');
                };
        };

        // Reasigna clase "seleccionado" de acuerdo a la categoria seleccionada
        for (let j = 0; j < daysColl.length; j++){
            if (anioFB[j] == catSeleccionada){		// Compara el array con la categoria seleccionada
                daysColl[j].classList.add("seleccionado");
                daysColl[j].setAttribute("categoria",anioFB[j]);
            }else {
                daysColl[j].classList.remove("seleccionado");
                daysColl[j].setAttribute("categoria",anioFB[j]);
            };
        };
};

// Categorias Array Handler
function catArrayHandler(dia, categoria) {
    if (anioFB[dia] == categoria){
        anioFB[dia] = " ";
    }else {
        anioFB[dia] = categoria;
    }
};

function getDaysInMonth(mes, anio) {
    let fecha = new Date(anio, mes, 1);
    let dias = [];
    while (fecha.getMonth() === mes) {
        dias.push(new Date(fecha));
        fecha.setDate(fecha.getDate() + 1);
    }
    return dias;
};

function getMonthsInYear(anio) {
    let fecha = new Date(anio, 0, 1);
    let meses = [];
    let mesCont = 0;
    while (mesCont < 12) {
        meses.push(new Date(fecha));
        fecha.setMonth(fecha.getMonth() + 1);
        mesCont++;
    }
    return meses;
}

// Crea el calendario completo de 12 meses
function buildYearCalendar(ref, anio) {
    cargaAnio();
    let meses = getMonthsInYear(anio);
    let opts = {
        clickHandler: function(e) {
            
            let dayNum = e.target.getAttribute("numero");
            let catDay = e.target.getAttribute("categoria")

            // Si hay una categoria seleccionada
            if (catSeleccionada != " "){
                // Si ya tiene la misma categoria seleccionada
                if (catDay == catSeleccionada){
                    // Borra la categoria
                    e.target.classList.remove("seleccionado");
                    e.target.setAttribute("categoria", " ");
                    catArrayHandler(dayNum, " ");
                }else {
                    e.target.classList.add('seleccionado');
                    e.target.setAttribute("categoria", catSeleccionada);
                    catArrayHandler(dayNum, catSeleccionada);                    
                }
            
            } else {alert("no hay categoria seleccionada")};
            salvaAnio(anioFB);
        }
    };

    dibujaCategorias();

    meses.forEach(function(a, b) {
        var $monthNode = buildMonth(b, anio, opts);
        ref.appendChild($monthNode);
    });
};

function buildMonth(monthNum, year, opts) {
        let daysInMonth = getDaysInMonth(monthNum, year);  
        let $monthNode = document.createElement('div');
        let $titleNode = document.createElement('h4');
        let skipLength = daysInMonth[0].getDay();   // Devuelve la cantidad de dias de la semana que se deven saltear al comienzo del mes
        let preLength = daysInMonth.length + skipLength;
        let postLength = function() {
            if (preLength % 7 === 0) {
                return 0;
            } else {
                if (preLength < 35) {
                    return 35 - preLength;
                } else {
                    return 42 - preLength;
                }
            }
        }

        $monthNode.classList.add('month');

        // Agrega el titulo al mes (Nombre + Año)
        $titleNode.innerText = monthNames[monthNum] + (" " + year);
        $monthNode.appendChild($titleNode);
        
        // Agrega los nombres de dias de la semana a la primera fila
        dayNames.forEach(function(a, b) {
            let $dayNode = document.createElement('div');
            $dayNode.classList.add('dow');
            $dayNode.innerText = dayNames[b];
            $monthNode.appendChild($dayNode);
        });
        
        // Agrega los dias en blanco antes del primer dia del mes
        for (let i = 0; i < skipLength; i++) {
            let $dayNode = document.createElement('div');
            $dayNode.classList.add('dummy-day');
            $monthNode.appendChild($dayNode);
        }

        // Place a day for each day of the month
        daysInMonth.forEach(function(c, d) {
            let $dayNode = document.createElement('div');
            $dayNode.classList.add('day');
            $dayNode.setAttribute("numero", numDia);

        	$dayNode.setAttribute("categoria", anioFB[numDia]);
            numDia++;

            // Agregar condicion de inicializacion del array del año
            //anioFB.push(" ");
            
            
            $dayNode.innerText = (d + 1);
            let dow = new Date(c).getDay();

            if (dow === 0 || dow === 6) $dayNode.classList.add('weekend');
            if (opts.clickHandler && !$dayNode.classList.contains('dummy-day')) {
                function handleEvent(e) {
                    e = e || window.event;
                    e.preventDefault();
                    e.stopPropagation();
                    let touches = false;
                    if (!touches) {
                        touches = true;
                        setTimeout(function() {
                            touches = false;
                        }, 300);
                        opts.clickHandler(e);
                    }
                }
                $dayNode.addEventListener("touchstart", handleEvent);
                $dayNode.addEventListener("mousedown", handleEvent);
               
            }
            $monthNode.appendChild($dayNode);
        });

        // Add in the dummy filler days to make an even block
        for (let j = 0; j < postLength(); j++) {
            let $dayNode = document.createElement('div');
            $dayNode.classList.add('dummy-day');
            $dayNode.innerText = j + 1;
            $monthNode.appendChild($dayNode);
        }
        return $monthNode;
}


let calendarioRef = document.getElementById("calendario");
let currentYear = new Date().getFullYear();
buildYearCalendar(calendarioRef, currentYear);

