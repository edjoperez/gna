Q_LIMIT = 100;
BUSY = 1;
IDLE = 0;

var sim_time = null;

var num_cuts_delayed, next_event_type, total_of_delays, area_num_in_q, area_server_status  = null;

var server_status, num_in_q, time_last_event = null;

var mean_interarrival, mean_service = null;

var time_next_event = [];
var time_arrival = [];

main = function(){
	//Define variables
	num_events = 2;
	
	num_delays_required = 14;
	mean_interarrival = 11.3;//Param Entrada - Promedio
	mean_service = 16.3;

	//PRINT STUFF

	//Inicializa los valores de la simulacion
	initialize();

	//Empieza la simulacion
	while(num_cuts_delayed < num_delays_required){
		//Determina el siguiente evento
		timing();

		//Actualiza el tiempo promedio estadistico acumulable
		update_time_avg_stats();

		//Invoca la siguiente funcion
		switch(next_event_type){
			case 1:
				arrive();
				break;
			case 2:
				depart();
				break;
		}
	}

	//Reporta los resultados
	report();
}

initialize = function(){
	sim_time = 0; //Inicializa el reloj del simulador

	//Inicializa los variables de estado
	server_status = IDLE;
	num_in_q = 0;
	time_last_event = 0;

	//Inicializa los contadores estadisticos
	num_cuts_delayed = 0;
	total_of_delays = 0;
	area_num_in_q = 0;
	area_server_status = 0;

	//Inicializa la lista de eventos
	time_next_event[0] = sim_time + expon(mean_interarrival); //tiempo entre arribos
	time_next_event[1] = time_next_event[0] + expon(mean_interarrival);
	time_next_event[2] = time_next_event[1] + expon(mean_interarrival);
	time_next_event[3] = Math.pow(10,30);
	
	//Arrivos
	time_arrival[0] = 2;
	time_arrival[1] = 4;
	time_arrival[2] = 5.2;
	time_arrival[3] = 7.8;

}


timing = function(){
	//Inicializa variables
	i = null;
	min_time_next_event = Math.pow(10,29);
	next_event_type = 0;
	for (var i = 1; i <= num_events; i++)
		if (time_next_event[i-1]<min_time_next_event) {
			min_time_next_event = time_next_event[i-1];
			next_event_type = i; //Obtiene el siguiente evento
		}

	if (next_event_type == 0) throw { name: "Lista de eventos vacia a la hora " ,message: sim_time};
	//Termina la ejecucion

	//La lista no se encuentra vacia, asi que el reloj del simulador continua
	sim_time = min_time_next_event;
}

arrive = function(){
	delay = null;

	//Programa el siguiente arribo
	time_next_event[0] = sim_time + expon(mean_interarrival); //Deberia indicar el siguiente tiempo entre arribos

	console.log("Ha arribado");
	//Verifica el estado del servidor
	if (server_status == BUSY) {
		//El servidor se encuentra ocupado asi que se incrementa el numero de clientes en cola
		num_in_q++;

		// //Verifica si existe una condicion de overflow
		// if (num_in_q > Q_LIMIT)
		// 	//La cola se encuentra en overflow, asi que se detiene la simulacion
		// 	throw { name: "Existe un Overflow en el tiempo de arribo al tiempo: "  ,message: sim_time};

		//Todavia existe espacio en la cola
		time_arrival[num_in_q] = sim_time;
	}
	else{
		//El servidor se encuentra en espera
		delay = 0;
		total_of_delays += delay;

		//Incrementa el numero de clientes retrasados
		num_cuts_delayed++;
		server_status = BUSY;

		//Programa una salida
		time_next_event[1] = sim_time + expon(mean_service);
	}
}

depart = function(){
	//Define variables
	var i, delay = null;
	console.log("Ha partido");

	//Verifica si la cola se encuentra vacia
	if (num_in_q == 0) {
		//La cola se encuentra vacia asi que asigna el servidor a disponible
		server_status = IDLE;
		time_next_event[1] = Math.pow(10,30);
	}
	else{
		//La cola no esta vacia
		num_in_q--;

		//Calcula la demora del cliente 
		delay = sim_time - time_arrival[1];
		total_of_delays += delay;

		//Incrementa el numero de clientes retrasados con partida programada
		num_cuts_delayed++;
		time_next_event[1] = sim_time + expon(mean_service);

		//Desplaza los clinetes una posicion en la cola
		for (var i = 0; i < num_in_q; i++)
			time_arrival[i] = time_arrival[i+1];
	}

}

report = function(){
	console.log("Promedio de demora en cola: "+ total_of_delays/num_cuts_delayed);
	console.log("Promedio en cola: "+ area_num_in_q / sim_time);
	console.log("Utilizacion del servidor: "+ area_server_status / sim_time);
	console.log("TIempo en el que la simulacion termino: "+ sim_time);
}

update_time_avg_stats = function(){
	var time_since_last_event;
	
	time_since_last_event = sim_time - time_last_event;
	time_last_event = sim_time;

	area_num_in_q += num_in_q * time_since_last_event;

	area_server_status += server_status * time_since_last_event;
}

expon = function(mean){
	return -mean * Math.log(1-Math.random());
}

main();