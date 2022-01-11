async function loadData() {
            let response = await fetch('https://mayz-pizza.herokuapp.com/api/sales/');
            let data = await response.json();
    
    new Chart(document.getElementById("monthlysales"), {
        type: 'line',
        data: {
          labels: data.tsgraph.glabels,
          datasets: [
            {
              label: "Sales (PHP)",
              data: data.tsgraph.gdata,
              borderColor: "rgba(104, 243, 172, 0.8)",
            pointHoverRadius: 3
            }
          ]
        },
        options: {
      plugins: {
          legend: { display: false}
        },
      scales: {
        y: { 
            grid:{
                color: "rgba(181, 164, 173, 0.8)"
            },
            ticks: {
                color: "white",
                font: {
                    family: "Montserrat"
                }
            }
        },
        x: {
            grid: {
                color: "rgba(181, 164, 173, 0.8)"
            },
            ticks: {
                color: "white",
                font: {
                    family: "Montserrat"
                }
            }
        }
      }
    }
    });



    new Chart(document.getElementById("topMonth"), {
        type: 'bar',
        data: {
          labels: data.top_this_month.labels,
          datasets: [
            {
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: data.top_this_month.data
            }
          ]
        },
        options: {
            indexAxis: 'y',
            plugins: {
          legend: { display: false }
        },
            scales: {
        y: { 
            grid:{
                display: false
            },
            ticks: {
                color: "white",
                font: {
                    family: "Montserrat"
                }
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: "white",
                font: {
                    family: "Montserrat"
                }
            }
        }
      }
    }
    });

    new Chart(document.getElementById("topAll"), {
        type: 'bar',
        data: {
          labels: data.top_all_time.labels,
          datasets: [
            {
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: data.top_all_time.data
            }
          ]
        },
        options: {
            indexAxis: 'y',
            plugins: {
          legend: { display: false }
        },
            scales: {
        y: { 
            grid:{
                display: false
            },
            ticks: {
                color: "white",
                font: {
                    family: "Montserrat"
                }
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: "white",
                font: {
                    family: "Montserrat"
                }
            }
        }
      }
    }
    });

    new Chart(document.getElementById("pie"), {
        type: 'doughnut',
        data: {
          labels: ["9 inch", "12 inch"],
          datasets: [
            {
              backgroundColor: ["#3e95cd", "#8e5ea2"],
              data: Object.values(data.sold_sizes)
            }
          ]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                    family: "Montserrat"
                }
                    }
                }
            }
        }
    });
    
    document.getElementById("no-monthly-sale").innerHTML = data.sales_this_month;
    document.getElementById("no-sales-growth").innerHTML = data.sales_growth;
    document.getElementById("no-total-sales").innerHTML = data.total_sales;

};

loadData();


async function genData() {
            let orderResponse = await fetch('https://mayz-pizza.herokuapp.com/api/orders/');
            let orderData = await orderResponse.json();
    
            let odResponse = await fetch('https://mayz-pizza.herokuapp.com/api/order_details/');
            let odData = await odResponse.json();
    
document.getElementById("dl-data").onclick = function exportWS() {
  var myFile = "qpos_data.xlsx";
  var orderSheet = XLSX.utils.json_to_sheet(orderData.orders);
  var odSheet = XLSX.utils.json_to_sheet(odData.order_details);
  var myWorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(myWorkBook, orderSheet, "ORDERS");
  XLSX.utils.book_append_sheet(myWorkBook, odSheet, "ORDER_DETAILS");
  XLSX.writeFile(myWorkBook, myFile);
}
    
    
};

genData();