import {useState} from 'react';
import './command-intelligence.css';

const insights=[
 {
  id:'crm',category:'CRM PERFORMANCE',question:'How well is our CRM converting leads, and what ROI is it delivering?',
  title:'Better follow-through is turning more enquiries into paid work.',
  summary:'Lead-to-deal conversion is 10%, up from a 6% comparison baseline. Faster assignment, fewer missed follow-ups and timely quotes account for the strongest improvement.',
  metrics:[['10%','Lead-to-deal conversion'],['₹4.8L','Estimated incremental collections'],['200%','Estimated net ROI']],
  evidence:['400 enquiries produced 160 qualified leads, 80 visits and 40 closed deals. The comparison baseline would produce 24 deals at the same enquiry volume.', 'The resulting 16 additional deals, at ₹30,000 collected per deal, contribute an estimated ₹4.8L in incremental collections.', 'At a 30% contribution margin, that is ₹1.44L before ₹48,000 in CRM and automation costs. Net contribution is ₹96,000; ROI is ₹96,000 ÷ ₹48,000 = 200%.'],
  action:'Prioritise qualified leads without a next action and quotes older than 48 hours. Keep the first response within five minutes, with a named owner for every follow-up.',
  note:'ROI uses a comparison-baseline estimate of incremental deals, not total approved quote value. Contribution margin is revenue after variable delivery costs.'
 },
 {
  id:'caller',category:'AGENTIC CALLER',question:'How is the Agentic Caller helping close deals, and what return is it bringing?',
  title:'The caller is recovering missed conversations and moving warm leads to visits.',
  summary:'The Agentic Caller assisted 30 closed deals by qualifying enquiries, answering initial questions and scheduling visits. Its estimated incremental contribution is 10 deals beyond the comparison baseline.',
  metrics:[['30','Caller-assisted deals'],['₹3L','Estimated incremental collections'],['150%','Estimated net ROI']],
  evidence:['600 call attempts reached 360 prospects, qualified 120 leads and booked 60 visits. Those visits resulted in 30 closed deals and ₹9L in collected value.', 'A comparable follow-up baseline of 20 closed deals implies 10 additional deals. At ₹30,000 each, incremental collected value is estimated at ₹3L.', 'A 30% contribution margin yields ₹90,000 before ₹36,000 in calling and orchestration costs. Net contribution is ₹54,000; ROI is ₹54,000 ÷ ₹36,000 = 150%.'],
  action:'Focus calling on fresh enquiries and warm quotes awaiting a decision. Hand pricing objections and technical concerns to a person, and stop repeat outreach once a customer declines.',
  note:'Assisted deals show influence, not sole causation. These deals overlap with CRM outcomes, so the two ROI estimates must not be added together.'
 },
 {
  id:'feedback',category:'CUSTOMER EXPERIENCE',question:'What are customers saying, and what should we improve first?',
  title:'Customers value clear scope and visible proof; scheduling is the main friction.',
  summary:'Feedback is strongest when customers understand the quote, know who is arriving and can see the work record. Uncertain arrival times and slow updates are the most actionable complaints.',
  metrics:[['4.6 / 5','Average customer rating'],['84','Feedback responses'],['90%','Would recommend · rounded']],
  evidence:['76 of 84 respondents would recommend the service. Feedback reflects respondents and may not represent every customer.', 'Clear explanations, professional applicators and stage photos are recurring positive themes. Customers want the same clarity around visit timing.', '18 responses mention arrival-time uncertainty; 9 mention delayed progress updates. Themes can overlap within a response.'],
  action:'Send a confirmed arrival window the evening before the visit, notify customers when the applicator is on the way, and share one concise update after every completed work stage.',
  note:'Track scheduling-related complaints and recommendation rate together next month to assess whether the changes improve the experience.'
 },
 {
  id:'growth',category:'MARKET OPPORTUNITY',question:'Which Bengaluru area should we target next, and why?',
  title:'Prioritise Electronic City, with capacity secured before increasing demand.',
  summary:'Electronic City combines the strongest qualified enquiry volume with higher opportunity value. Expand in a controlled area first so additional leads turn into completed work rather than longer waiting times.',
  metrics:[['138','Qualified enquiries'],['₹34,000','Average opportunity value'],['82%','Applicator capacity in use']],
  evidence:['Electronic City has 138 qualified enquiries versus 96 in Whitefield and 82 in Sarjapur for the same reporting window.', 'Average opportunity value is ₹34,000 versus a city benchmark of ₹29,000, approximately 17% higher. This measures potential scope, not realised revenue.', 'At 82% capacity utilisation, the current team has limited headroom. Converting 20% of these enquiries would create approximately 28 jobs and ₹9.5L in potential approved scope.'],
  action:'Secure two additional certified applicators and confirm dealer stock first. Then run a focused terrace-waterproofing campaign, reviewing booked visits, completed jobs and acquisition cost weekly.',
  note:'The ₹9.5L opportunity is a planning estimate, not a revenue forecast. Scale spend only after confirming delivery capacity and actual conversion.'
 }
];

function matchQuestion(question:string){
 const q=question.toLowerCase();
 if(/caller|calling|calls|agentic/.test(q))return insights[1];
 if(/feedback|customer|rating|review|satisfaction/.test(q))return insights[2];
 if(/area|target|territor|expand|growth|bengaluru|market/.test(q))return insights[3];
 if(/crm|roi|return|conversion|converting|leads|revenue/.test(q))return insights[0];
 return null;
}

export function CommandIntelligence(){
 const [question,setQuestion]=useState('');
 const [answer,setAnswer]=useState<typeof insights[number]|null>(null);
 const [asked,setAsked]=useState('');
 const [message,setMessage]=useState('');
 function showInsight(insight:typeof insights[number],text=insight.question){setAnswer(insight);setAsked(text);setMessage('');}
 return <section className="command-intelligence" aria-label="Command AI">
  <div className="ci-heading"><span className="ci-eyebrow">ARDEX INTELLIGENCE</span><h2>Command AI</h2><p>Ask a business question. See what matters and where to act.</p></div>
  <form className="ci-prompt" onSubmit={event=>{event.preventDefault();const result=matchQuestion(question);if(result)showInsight(result,question.trim());else setMessage('Try a question about CRM ROI, agentic calling, customer feedback or Bengaluru growth.');}}>
   <label htmlFor="command-question">Ask ARDEX Intelligence</label>
   <div className="ci-input-row"><input id="command-question" value={question} onChange={event=>setQuestion(event.target.value)} placeholder="Ask about conversion, ROI, customer feedback or growth…"/><button type="submit" disabled={!question.trim()}>Ask <span aria-hidden="true">→</span></button></div>
  </form>
  <div className="ci-suggestions"><p>Start with a question</p><div>{insights.map(insight=><button type="button" key={insight.id} aria-pressed={answer?.id===insight.id} onClick={()=>showInsight(insight)}><span>{insight.category}</span><strong>{insight.question}</strong><i aria-hidden="true">↗</i></button>)}</div></div>
  {message&&<p className="ci-message" role="status">{message}</p>}
  <div aria-live="polite" aria-atomic="true">
   {answer&&<article className="ci-answer" aria-label="Business insight">
    <div className="ci-answer-top"><span className="ci-eyebrow">{answer.category}</span><span>Management snapshot · Last 30 days</span></div>
    <p className="ci-asked">{asked}</p><h3>{answer.title}</h3><p className="ci-summary">{answer.summary}</p>
    <div className="ci-metrics">{answer.metrics.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <div className="ci-detail"><div><h4>What supports this</h4><ul>{answer.evidence.map(item=><li key={item}>{item}</li>)}</ul></div><aside><h4>Recommended next step</h4><p>{answer.action}</p></aside></div>
    <p className="ci-note">{answer.note}</p>
   </article>}
  </div>
 </section>;
}
