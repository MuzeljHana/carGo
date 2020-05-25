function exportConfirmation(){
    var content;
    var date = new Date();

    var transportName = document.getElementById("transportName").innerHTML;
    var price = document.getElementById("price").innerHTML;
    var orderDate = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
    var customerName = document.getElementById("customerName").innerHTML;
    var customerAddress = document.getElementById("customerAddress").innerHTML;

    var choice = document.getElementById("formatChoice").value;

    switch (choice) {
        case "txt":
            content = "Order confirmed\n\nOrder summary\nTransport vehicle: " + transportName + "\nPrice: " + price + 
                "\nOrder date: " + orderDate + "\n\nCustomer information\n" + customerName + "\n" + customerAddress;

            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', "OrderInfo");
            
            element.style.display = 'none';
            document.body.appendChild(element);
            
            element.click();
            
            document.body.removeChild(element);        
            break;
        case "pdf":
            var doc = new jsPDF();
            doc.fromHTML($("#prikazIzbire").get(0), 20, 20);
            doc.save("Order.pdf");
        }

}