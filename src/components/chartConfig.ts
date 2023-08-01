export const data = {
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs', 'Dick'],
    datasets: [
        {
            // backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [40, 220, 80, 10, 120],
            rough: {
                roughness: 1
            }
        }
    ]
}

export const options = {
    plugins: {
        legend: {
            display: false,
        }
    }
}
