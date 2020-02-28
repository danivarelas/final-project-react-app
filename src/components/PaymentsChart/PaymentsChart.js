import React from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import { ResponsiveContainer, PieChart, Pie, Legend, LabelList } from 'recharts';

const PaymentsChart = (props) => {

    const history = useHistory();

    const { values, titles } = props;

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    let colors = ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)']

    const data = [
        { name: titles[0], value: values[0] , fill: colors[0] },
        { name: titles[1], value: values[1] , fill: colors[1] },
        { name: titles[2], value: values[2] , fill: colors[2] },
        { name: titles[3], value: values[3] , fill: colors[3] },
        { name: titles[4], value: values[4] , fill: colors[4] },
        { name: titles[5], value: values[5] , fill: colors[5] }
    ];

    return (
        <ResponsiveContainer width="100%" height="85%">
             <PieChart >
                 <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="55%" innerRadius={30} outerRadius={80} label>
                     <LabelList dataKey="value" />
                 </Pie>
                 <Legend iconSize={10} layout="horizontal" verticalAlign="top" />
             </PieChart>
        </ResponsiveContainer>
    );

}

export default PaymentsChart;
