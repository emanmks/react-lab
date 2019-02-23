import React from 'react'

// import the head component of next
import Head from 'next/head'
import Link from 'next/link'

// import axios to handle AJAX call
import axios from 'axios'

// function Home() {
//     return <h1>EPL updates</h1>
// }
  
// export default Home

// Or

// export default () => (
//     <div>
//         <Head>
//             <title>EPL Updates</title>
//             <meta name="viewport" content="initial-scale=1.0, width=device-width" />
//             <link rel="stylesheet" href="https://unpkg.com/purecss@0.6.1/build/pure-min.css" />
//         </Head>
//         <h1>This is English Premier League</h1>
//     </div>
// )

// Better structure
export default class extends React.Component {
    static async getInitialProps({query}) {
        const id = query.id

        if(!process.browser) {
            const res = await axios.get('http://api.football-data.org/v2/competitions/2021/standings', {
                headers: {
                    'X-Auth-Token': '8bfe4868593447f69a476d5983e23251'
                }
            })

            return {
                data: res.data.standings[0],
            }
        } else {
            return {data: JSON.parse(sessionStorage.getItem('bpl'))}
        }
    }

    componentDidMount () {
        if(!sessionStorage.getItem('bpl')) sessionStorage.setItem('bpl', JSON.stringify(this.props.data))
    }

    render () {
        return (
            <div>
                <Head>
                    <title>EPL Updates</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="stylesheet" href="https://unpkg.com/purecss@0.6.1/build/pure-min.css" />
                </Head>

                <div className="pure-g">
                    <div className="pure-u-1-3"></div>
                    <div className="pure-u-1-3">
                        <h1>Barclays Premier League</h1>
                        <table className="pure-table">
                            <thead>
                            <tr>
                                <th>Position</th>
                                <th>Team</th>
                                <th>P</th>
                                <th>W</th>
                                <th>D</th>
                                <th>L</th>
                                <th>GD</th>
                                <th>More</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.data.table.map((standing, i) => {
                            const oddOrNot = i % 2 == 1 ? "pure-table-odd" : "";
                            return (
                                <tr key={i} className={oddOrNot}>
                                    <td>{standing.position}</td>
                                    <td><img className="pure-img logo" src={standing.team.crestUrl}/></td>
                                    <td>{standing.points}</td>
                                    <td>{standing.won}</td>
                                    <td>{standing.draw}</td>
                                    <td>{standing.lost}</td>
                                    <td>{standing.goalDifference}</td>
                                    <td><Link href={`/details?id=${standing.position}`}>...</Link></td>
                                </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className="pure-u-1-3"></div>
                </div>
            </div>
        );
    }
}
