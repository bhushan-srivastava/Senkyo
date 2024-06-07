import { Pie, Bar } from 'react-chartjs-2';


const Results = ({ data }) => {
    const pieChartData = {
        labels: Object.keys(data.totalVotesByCandidate),
        datasets: [
            {
                label: 'Total Votes',
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                data: Object.values(data.totalVotesByCandidate),
            },
        ],
    };

    const barChartData = {
        labels: Object.keys(data.totalVotesByCandidate),
        datasets: [
            {
                label: 'Total Votes',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 1,
                data: Object.values(data.totalVotesByCandidate),
            },
        ],
    };


    return (

        <>
            <Pie data={pieChartData} />
            <Bar data={barChartData} options={{}} />
        </>
    );
}


export default Results;