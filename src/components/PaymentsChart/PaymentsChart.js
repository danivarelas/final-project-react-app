import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Chart from 'chart.js';

const PaymentsChart = (props) => {

    const history = useHistory();

    const [chartCells, setChartCells] = useState([]);
    const [chartTitles, setChartTitles] = useState([]);
    const [context, setContext] = useState({});

    const { serviceTypes, services, payments, chartId, isUSD } = props;
    //const [currentDate, setCurrentDate] = useState(new Date());

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        setContext(document.getElementById(chartId));
        if (serviceTypes) {
            let valuesCRC = [serviceTypes.length];
            let valuesUSD = [serviceTypes.length];
            let titles = [serviceTypes.length];
            for (var i = 0; i < serviceTypes.length; i++) {
                valuesCRC[i] = 0;
                valuesUSD[i] = 0;
                titles[i] = serviceTypes[i].serviceTypeName;
            }
            setChartTitles(titles);
            let paymentsInCRC = [];
            let paymentsInUSD = [];
            if (payments) {
                paymentsInCRC = payments.filter((payment) => payment.currency === "CRC");
                paymentsInUSD = payments.filter((payment) => payment.currency === "USD");
                var j = 0;

                if (paymentsInCRC && paymentsInCRC.length) {
                    for (j = 0; j < paymentsInCRC.length; j++) {
                        let payment = paymentsInCRC[j];
                        let amount = parseFloat(payment.amount);
                        let serviceTypeId = services.filter((service) => payment.serviceId === service.id);
                        serviceTypeId = serviceTypeId[0];
                        if (serviceTypeId) {
                            serviceTypeId = serviceTypeId.serviceTypeId;
                            valuesCRC[serviceTypeId - 1] = valuesCRC[serviceTypeId - 1] + amount;
                        }
                    }
                }

                if (paymentsInUSD && paymentsInUSD.length) {
                    for (j = 0; j < paymentsInUSD.length; j++) {
                        let payment = paymentsInUSD[j];
                        let amount = parseFloat(payment.amount);
                        let serviceTypeId = services.filter((service) => payment.serviceId === service.id);
                        serviceTypeId = serviceTypeId[0];
                        if (serviceTypeId) {
                            serviceTypeId = serviceTypeId.serviceTypeId;
                            valuesUSD[serviceTypeId - 1] = valuesUSD[serviceTypeId - 1] + amount;
                        }
                    }
                }
            }

            let data = isUSD ? valuesUSD : valuesCRC;
            setChartCells(data);
            
        }

    }, [chartId, isUSD, payments, serviceTypes, services]);

    if (context) {
        var myChart = new Chart(context, {
            type: 'pie',
            data: {
                labels: [1,2,3,2,1],
                datasets: [{
                    label: '# of Votes',
                    data: [1,2,3,2,1],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: { responsive: true}
        });
    }

    return (
        <canvas id={chartId}></canvas>
    );

}

export default PaymentsChart;




// import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
// import validate from '../../utils/JWTParser';
// import { PieChart, Pie, ResponsiveContainer, Legend, LabelList } from 'recharts';

// const PaymentsChart = (props) => {

//     const history = useHistory();

//     const [chartCells, setChartCells] = useState([]);

//     const { serviceTypes, services, payments, chartId, isUSD } = props;
//     //const [currentDate, setCurrentDate] = useState(new Date());

//     if (!validate(sessionStorage.getItem('JWT'))) {
//         history.push("/login");
//     }

//     useEffect(() => {
//         if (serviceTypes) {
//             let valuesCRC = [serviceTypes.length];
//             let valuesUSD = [serviceTypes.length];
//             let titles = [serviceTypes.length];
//             for (var i = 0; i < serviceTypes.length; i++) {
//                 valuesCRC[i] = 0;
//                 valuesUSD[i] = 0;
//                 titles[i] = serviceTypes[i].serviceTypeName;
//             }
//             let paymentsInCRC = [];
//             let paymentsInUSD = [];
//             if (payments) {
//                 paymentsInCRC = payments.filter((payment) => payment.currency === "CRC");
//                 paymentsInUSD = payments.filter((payment) => payment.currency === "USD");
//                 var j = 0;

//                 if (paymentsInCRC && paymentsInCRC.length) {
//                     for (j = 0; j < paymentsInCRC.length; j++) {
//                         let payment = paymentsInCRC[j];
//                         let amount = parseFloat(payment.amount);
//                         let serviceTypeId = services.filter((service) => payment.serviceId === service.id);
//                         serviceTypeId = serviceTypeId[0];
//                         if (serviceTypeId) {
//                             serviceTypeId = serviceTypeId.serviceTypeId;
//                             valuesCRC[serviceTypeId - 1] = valuesCRC[serviceTypeId - 1] + amount;
//                         }
//                     }
//                 }

//                 if (paymentsInUSD && paymentsInUSD.length) {
//                     for (j = 0; j < paymentsInUSD.length; j++) {
//                         let payment = paymentsInUSD[j];
//                         let amount = parseFloat(payment.amount);
//                         let serviceTypeId = services.filter((service) => payment.serviceId === service.id);
//                         serviceTypeId = serviceTypeId[0];
//                         if (serviceTypeId) {
//                             serviceTypeId = serviceTypeId.serviceTypeId;
//                             valuesUSD[serviceTypeId - 1] = valuesUSD[serviceTypeId - 1] + amount;
//                         }
//                     }
//                 }
//             }

//             let data2 = isUSD ? valuesUSD : valuesCRC;
//             let colors = ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)']

//             const data = [
//                 { name: titles[0], value: data2[0] , fill: colors[0] },
//                 { name: titles[1], value: data2[1] , fill: colors[1] },
//                 { name: titles[2], value: data2[2] , fill: colors[2] },
//                 { name: titles[3], value: data2[3] , fill: colors[3] },
//                 { name: titles[4], value: data2[4] , fill: colors[4] },
//                 { name: titles[5], value: data2[5] , fill: colors[5] }
//             ];
//             setChartCells(data);
            
//         }

//     }, [chartId, isUSD, payments, serviceTypes, services]);

//     return (
//         <ResponsiveContainer width="100%" height="85%">
//             <PieChart >
//                 <Pie data={chartCells} dataKey="value" nameKey="name" cx="50%" cy="55%" innerRadius={30} outerRadius={80} label>
//                     <LabelList dataKey="value" />
//                 </Pie>
//                 <Legend iconSize={10} layout="horizontal" verticalAlign="top" />
//             </PieChart>
//         </ResponsiveContainer>

//     );

// }

// export default PaymentsChart;


