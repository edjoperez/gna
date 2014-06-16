function PESI(a,b){
	//Var declarations
	arr_a = [];
	arr_b = [];
	c = 0;

	//Obtiene divisores en a
	for (var i = 1 ; i <= a; i++)
		if (a/i == parseInt(a/i))
			arr_a.push(i);
	//Obtiene divisores en b
	for (var i = 1 ; i <= b; i++)
		if (b/i == parseInt(b/i))
			arr_b.push(i);

	for (var i = arr_a.length - 1; i >= 0; i--) {
		if (arr_b.indexOf(arr_a[i])!= -1 ){c++; console.log('A ' + arr_a[i])} 
	};

	for (var i = arr_b.length - 1; i >= 0; i--) {
		if (arr_a.indexOf(arr_b[i])!= -1 ){c++; console.log('B ' + arr_b[i])} 
	};
	console.log(c);
	console.log(arr_a);
	console.log(arr_b);
	return (c/2>=1 && a!= 1 && b!= 1)? true:false;
}