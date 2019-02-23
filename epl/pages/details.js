import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios';

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
                data: res.data.standings[0].table,
                standing: res.data.standings[0].table.filter(s => s.position == id)
            }
        } else {
            const bplData = JSON.parse(sessionStorage.getItem('bpl'))
            return {standing: bplData.standing.filter(s => s.position == id)}
        }
    }

    componentDidMount () {
        // Cache data in localStorage if
        // not already cached
        if(!sessionStorage.getItem('bpl')) sessionStorage.setItem('bpl', JSON.stringify(this.props.data))
    }

    render() {
        const detailStyle = {
            ul: {
                marginTop: '100px'
            }
        }

        return  (
            <div>
               <Head>
                   <title>League Table</title>
                   <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                   <link rel="stylesheet" href="https://unpkg.com/purecss@0.6.1/build/pure-min.css" />
               </Head>

               <div className="pure-g">
                   <div className="pure-u-8-24"></div>
                   <div className="pure-u-4-24">
                       <h2>{this.props.standing[0].team.name}</h2>
                       <img src={this.props.standing[0].team.crestUrl} className="pure-img"/>
                       <h3>Points: {this.props.standing[0].points}</h3>
                   </div>
                   <div className="pure-u-12-24">
                       <ul style={detailStyle.ul}>
                           <li><strong>Wins</strong>: {this.props.standing[0].won}</li>
                           <li><strong>Losses</strong>: {this.props.standing[0].lost}</li>
                           <li><strong>Draws</strong>: {this.props.standing[0].draw}</li>
                           <li><strong>Goal Difference</strong>: {this.props.standing[0].goalDifference}</li>
                        </ul>
                        <Link href="/">Home</Link>
                    </div>
                </div>
             </div>
        )
    }    
}