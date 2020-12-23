const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septimbre", "Octubre", "Noviembre", "Diciembre"];
const dayNames = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const catNode = document.getElementById('categorias');
const selCatNode = document.getElementById('selCat');

function getDaysInMonth(month, year) {
    let date = new Date(year, month, 1);
    let days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

function getMonthsInYear(year) {
    let date = new Date(year, 0, 1);
    let months = [];
    let monthCount = 0;
    while (monthCount < 12) {
        months.push(new Date(date));
        date.setMonth(date.getMonth() + 1);
        monthCount++;
    }
    return months;
}

function getMonthsInRange(startDate, endDate) {
    let start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    let end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    let months = [];
    let monthCount = 0;
    while (start <= end) {
        months.push( new Date(start) );
        start.setMonth(start.getMonth() + 1);
        monthCount++;
    }
    return months;
}

// Create a full 12-month calendar
function buildYearCalendar(el, year) {
    // cargaAnio();
    let months = this.getMonthsInYear(year);
/////////////////////////////////        opts   /////////////////////////////////////////////////
    let opts = {
        showMonth: true,
        showDaysOfWeek: true,
        showYear: true,
/////////////////////////////////     Dia   ClickHandler   /////////////////////////////////////////////////
        clickHandler: function(e) {
            
         /*   let dayNum = e.target.getAttribute("numero");
            let catDay = e.target.getAttribute("categoria")

            // Si hay una categoria seleccionada
            if (catSeleccionada != " "){
                // Si ya tiene la misma categoria seleccionada
                console.log("catDay: "+catDay);
                console.log("catSeleccionada: "+catSeleccionada);
                if (catDay == catSeleccionada){
                    // Borra la categoria
                    e.target.classList.remove("seleccionado");
                    e.target.setAttribute("categoria", " ");
                    arrayHandler(dayNum, " ");
                }else {
                    e.target.classList.add('seleccionado');
                    e.target.setAttribute("categoria", catSeleccionada);
                    arrayHandler(dayNum, catSeleccionada);
                    console.dir(dayNum);
                }
            
            } else {alert("no hay categoria seleccionada")};
            salvaAnio(anio);*/
        }
    }

    // dibujaCategorias();

    months.forEach(function(a, b) {
        var $monthNode = buildMonth(b, year, opts);
        el.appendChild($monthNode);
    });

function buildMonthsInRange (el, opts, startDate, limit) {
        
        let endDate = new Date( new Date().setDate(startDate.getDate() + limit) );
        let months = this.getMonthsInRange(startDate, endDate);
        
        opts = opts  || {};
        opts.limitDate = endDate || false;
        if (opts.reverse) months = months.reverse();

        months.forEach(function(a, b) {
            let month = a.getMonth();
            let year = a.getFullYear();
            let $monthNode = _this.buildMonth(month, year, opts);
            el.appendChild($monthNode);
        });
    }


function buildMonth(monthNum, year, opts) {
        //if (monthNum === undefined || year === undefined) return "something is missing";
        let _this = this;
        let dtm = new Date(year, monthNum, 1);
        let dtmMonth = dtm.getMonth();
        let daysInMonth = _this.getDaysInMonth(monthNum, year);  
        let $monthNode = document.createElement('div');
        let $titleNode = document.createElement('h4');
        let skipLength = daysInMonth[0].getDay();
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

        // Add a Title to the month
        if (opts.showMonth) {
            $titleNode.innerText = monthNames[monthNum] + (opts.showYear ? " " + year : '');
            $monthNode.appendChild($titleNode);
        }
        // Add Days of week to the top row
        if (opts.showDaysOfWeek) {
            dayNames.forEach(function(a, b) {
                let $dayNode = document.createElement('div');
                $dayNode.classList.add('dow');
                $dayNode.innerText = dayNames[b];
                $monthNode.appendChild($dayNode);
            });
        }
        // Add blank days to fill in before first day
        for (let i = 0; i < skipLength; i++) {
            let $dayNode = document.createElement('div');
            $dayNode.classList.add('dummy-day');
            $monthNode.appendChild($dayNode);
        }
//////////////////////////// Dibuja cada dia del Mes ////////////////////////////
        // Place a day for each day of the month
        daysInMonth.forEach(function(c, d) {
            let today = new Date(new Date().setHours(0, 0, 0, 0));
            let $dayNode = document.createElement('div');
            $dayNode.classList.add('day');
        //    $dayNode.setAttribute("numero", numDia);

        //	$dayNode.setAttribute("categoria", anio[numDia]);
        //    numDia++;

            //anio.push(" ");
            
            $dayNode.innerText = (d + 1);
            let dow = new Date(c).getDay();

            if (dow === 0 || dow === 6) $dayNode.classList.add('weekend');
            if (opts.onlyCurrent && c < today) $dayNode.classList.add('dummy-day');
            if (opts.limitDate) {
                if (c > opts.limitDate) {
                    $dayNode.classList.add('dummy-day');
                }
            }

            if (opts.filterDayOfWeek) {
                let valid = false;
                for (let i = 0; i < opts.filterDayOfWeek.length; i++) {
                    if (c.getDay() == opts.filterDayOfWeek[i]) {
                        valid = true;
                    }
                }
                if (!valid) {
                    $dayNode.classList.add('dummy-day');
                }
            }
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
}

//console.log(getDaysInMonth(0, 2021));
//console.log(getMonthsInYear(2021));

var calendarioRef = document.getElementById("calendario");
var currentYear = new Date().getFullYear();
//var calendario = new crearCalendario();
buildYearCalendar(calendarioRef, currentYear);

