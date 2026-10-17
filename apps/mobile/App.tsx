import {useState} from 'react';
import {SafeAreaView,ScrollView,Text,View,Pressable,StyleSheet,Alert,Image} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import * as LocalAuthentication from 'expo-local-authentication';
import {sentinel,rxToShelf,driftRadar,threadPulse} from '../../packages/engine';
import {demoRecord,demoPlan,demoReadings} from '../../packages/shared/demo';
import {words,languages,type Language} from '../../packages/i18n';

const tabs=['Today','Records','Medicines','Monitoring','Wellbeing','Cycle','Privacy','Lab'] as const;
type Tab=typeof tabs[number];
const sample=demoRecord();

Notifications.setNotificationHandler({handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:true,shouldSetBadge:false})});

function Button({title,onPress}:{title:string;onPress:()=>void}){
  return <Pressable accessibilityRole="button" style={styles.button} onPress={onPress}><Text style={styles.buttonText}>{title}</Text></Pressable>;
}

function Card({title,children}:{title:string;children:React.ReactNode}){
  return <View style={styles.card}><Text style={styles.h2}>{title}</Text>{children}</View>;
}

const YOGA_ROUTINES = [
  {name:'Sukhasana (Easy Pose)', duration:'5 min', benefit:'Calms the mind, reduces stress'},
  {name:'Balasana (Child\'s Pose)', duration:'3 min', benefit:'Gentle stretch for back and hips'},
  {name:'Tadasana (Mountain Pose)', duration:'3 min', benefit:'Improves posture and balance'},
  {name:'Virabhadrasana I (Warrior I)', duration:'4 min', benefit:'Builds strength and stability'},
  {name:'Savasana (Corpse Pose)', duration:'5 min', benefit:'Full body relaxation, reduces fatigue'},
];

export default function App(){
  const [tab,setTab]=useState<Tab>('Today');
  const [consent,setConsent]=useState(false);
  const [language,setLanguage]=useState<Language>('en-IN');
  const [taken,setTaken]=useState(false);
  const [locked,setLocked]=useState(false);
  const [danger,setDanger]=useState(false);
  const [message,setMessage]=useState('');
  const w=words[language];

  async function run(action:()=>Promise<void>){
    try{await action();}
    catch(e){setMessage(e instanceof Error?e.message:'Action failed. Please retry.');}
  }

  async function recordTaken(){
    await SecureStore.setItemAsync('ayusetu-demo-checkin',JSON.stringify({taken:true,at:new Date().toISOString()}));
    setTaken(true);
    setMessage('Synthetic check-in stored using the device secure store.');
  }

  async function remind(){
    if(!consent)throw new Error('Consent required');
    await Notifications.setNotificationChannelAsync('demo',{name:'Demo reminders',importance:Notifications.AndroidImportance.DEFAULT});
    const result=await Notifications.requestPermissionsAsync();
    if(result.status!=='granted')throw new Error('Notifications permission not granted. Use the in-app check-in.');
    await Notifications.scheduleNotificationAsync({content:{title:'AYUSETU demo check-in',body:'Open the app for your private reminder.',sound:true},trigger:{type:Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,seconds:60,channelId:'demo'}});
    setMessage('One demonstration notification scheduled for about one minute. Delivery time depends on the OS; this is not an exact alarm.');
  }

  async function unlock(){
    if(!await LocalAuthentication.hasHardwareAsync()||!await LocalAuthentication.isEnrolledAsync())
      throw new Error('Biometric authentication is not configured on this device.');
    const r=await LocalAuthentication.authenticateAsync({promptMessage:'Unlock AYUSETU demo'});
    if(r.success)setLocked(false);
    else setMessage('Authentication cancelled.');
  }

  const body=
    tab==='Today'?<>
      <Text style={styles.h1}>{w.welcome}</Text>
      <Card title="Good morning, Sunita.">
        <Text style={styles.text}>Your connected care journey uses synthetic data. This app works offline with the same engine as the website.</Text>
      </Card>
      <Card title="Medication check-in">
        <Text style={styles.text}>Illustrative schedule only. Follow your clinician's prescription.</Text>
        <Button title={taken?'Recorded':'Mark taken'} onPress={()=>run(recordTaken)}/>
        <Button title="Schedule a demo reminder" onPress={()=>run(remind)}/>
      </Card>
    </>:

    tab==='Records'?<>
      <Text style={styles.h1}>{w.thread}</Text>
      {sample.observations.map(o=><Card key={o.id} title={`${o.value} ${o.unit}`}>
        <Text style={styles.text}>Source: {o.source} • {o.sampledAt.slice(0,10)}{'\n'}LOINC {o.code}. Synthetic fixture.</Text>
      </Card>)}
      <Text style={styles.text}>Live upstream sync and server FHIR export are available only in the web demo; native sync is pending.</Text>
    </>:

    tab==='Medicines'?<>
      <Text style={styles.h1}>{w.medicines}</Text>
      <Card title="Course-valid medicine access">
        <Text style={styles.text}>Illustrative metformin 500 mg prescription: 60 tablets. Pharmacist review required.</Text>
        <Text style={styles.big}>₹{(rxToShelf(demoPlan()).plans[0]?.costPaise??0)/100}</Text>
        <Text style={styles.text}>East stock plus transfer. Synthetic price. The cheapest North batch expires before the course ends and is rejected.</Text>
        <Text style={styles.code}>{JSON.stringify(rxToShelf(demoPlan()).explanation,null,2)}</Text>
      </Card>
    </>:

    tab==='Monitoring'?<>
      <Text style={styles.h1}>{w.monitor}</Text>
      <Card title="Drift Radar">
        <Text style={styles.text}>21 synthetic BP readings. Baseline {driftRadar({readings:demoReadings}).baseline} mmHg.</Text>
        <Text style={styles.text}>Trend flag: {driftRadar({readings:demoReadings}).alert?'review needed':'no trend detected'}. Robust CUSUM, not clinical validation.</Text>
        <View style={styles.bars}>{demoReadings.map(r=><View key={r.day} style={[styles.bar,{height:(r.value-110)*2}]}/>)}</View>
      </Card>
      <Card title="Wearable connection status">
        <Text style={styles.text}>Health Connect, HealthKit and real BLE are not connected. Wearable simulation is available in the web demo.</Text>
      </Card>
    </>:

    tab==='Wellbeing'?<>
      <Text style={styles.h1}>Small steps, every day</Text>
      <Card title="Comfortable movement">
        <Text style={styles.text}>WHO guidance for adults: 150–300 minutes of moderate activity each week. Individual limitations need clinician advice.</Text>
        <Text style={styles.text}>No lifespan or risk prediction is made. Do not change prescribed treatment.</Text>
      </Card>
      <Card title="Yoga & Mobility Routine">
        <Text style={styles.sectionNote}>Gentle poses suitable for most adults. Stop if you feel any discomfort.</Text>
        {YOGA_ROUTINES.map((pose,idx)=>(
          <View key={idx} style={styles.yogaRow}>
            <View style={styles.yogaIndex}><Text style={styles.yogaIndexText}>{idx+1}</Text></View>
            <View style={styles.yogaInfo}>
              <Text style={styles.yogaName}>{pose.name}</Text>
              <Text style={styles.yogaMeta}>{pose.duration} · {pose.benefit}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.disclaimer}>Consult your clinician before starting any exercise programme.</Text>
      </Card>
      <Card title="A moment to pause">
        <Text style={styles.text}>Sit comfortably and breathe naturally. Avoid forceful breathing or breath holding. Stop if uncomfortable. This is a relaxation prompt, not treatment.</Text>
      </Card>
    </>:

    tab==='Cycle'?<>
      <Text style={styles.h1}>Cycle wellbeing</Text>
      <Card title="Private by default">
        <Text style={styles.text}>Synthetic cycle lengths: 31, 38, 45, 34 days. This cannot diagnose PCOS or predict fertility. No cycle data is shared or stored.</Text>
        <Text style={styles.text}>Seek urgent care for severe pain, very heavy bleeding or fainting. Discuss concerning patterns with a qualified clinician.</Text>
      </Card>
    </>:

    tab==='Privacy'?<>
      <Text style={styles.h1}>{w.privacy}</Text>
      <Card title="On this device">
        <Text style={styles.text}>Synthetic fixtures are bundled with the app. Optional check-in uses SecureStore. No network calls, analytics or cloud sync are configured. This is not a network-egress audit.</Text>
        <Text style={styles.text}>Cognee runs separately on a local computer; this app is not connected to it.</Text>
        <Button title="Test biometric app lock" onPress={()=>run(async()=>{if(!await LocalAuthentication.isEnrolledAsync())throw new Error('No enrolled biometric available');setLocked(true);})}/>
        <Button title="Delete check-in and revoke consent" onPress={()=>run(async()=>{await SecureStore.deleteItemAsync('ayusetu-demo-checkin');await Notifications.cancelAllScheduledNotificationsAsync();setTaken(false);setConsent(false);setMessage('Check-in deleted. Demo notifications cancelled.');})}/>
      </Card>
    </>:

    <>
      <Text style={styles.h1}>{w.lab}</Text>
      <Card title="Triage Sentinel">
        <Text style={styles.text}>{sentinel({answers:danger?{chestPain:'yes'}:{}}).explanation.action}</Text>
        <Button title={danger?'Reset red-flag test':'Test chest-pain red flag'} onPress={()=>setDanger(!danger)}/>
      </Card>
      <Card title="ThreadPulse">
        <Text style={styles.code}>{JSON.stringify(threadPulse({probabilities:[.8,.7,.9,.3,.5],stock:2}),null,2)}</Text>
      </Card>
    </>;

  return (
    <SafeAreaView style={styles.safe}>
      {/* FIXED TOP HEADER — always visible */}
      <View style={styles.header}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="AYUSETU logo"
        />
        <View>
          <Text style={styles.brand}>AYUSETU <Text style={styles.badge}>Demo data</Text></Text>
          <Text style={styles.subtitle}>Care that stays connected</Text>
        </View>
      </View>

      {/* FIXED TAB BAR — never scrolls away */}
      {consent && !locked && (
        <View style={styles.tabBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map(t=>(
              <Pressable
                key={t}
                accessibilityRole="tab"
                accessibilityState={{selected:t===tab}}
                onPress={()=>setTab(t)}
                style={[styles.tab,t===tab&&styles.active]}
              >
                <Text style={[styles.tabText,t===tab&&styles.activeTabText]}>{t}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* SCROLLABLE CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        {message?<Text accessibilityRole="alert" style={styles.message}>{message}</Text>:null}

        {locked?(
          <Card title="App locked">
            <Button title="Unlock with biometrics" onPress={()=>run(unlock)}/>
          </Card>
        ):!consent?(
          <Card title="Your care, connected">
            <Text style={styles.text}>Explore synthetic data only. No real medical data is collected. Interface translations are illustrative, not clinician verified.</Text>
            <Button title="Agree to on-device demo processing" onPress={()=>setConsent(true)}/>
          </Card>
        ):(
          <>
            {/* Language selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageBar}>
              {Object.entries(languages).map(([k,label])=>(
                <Pressable key={k} onPress={()=>setLanguage(k as Language)} style={styles.language}>
                  <Text style={[styles.languageText,language===k&&styles.languageActive]}>{label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {body}

            <Button title="Emergency help information" onPress={()=>Alert.alert('Emergency help','Seek local emergency services or immediate in-person care for urgent symptoms. This demo cannot dispatch help, send caregiver alerts or share location.')}/>
          </>
        )}

        <Text style={styles.footer}>Synthetic data • Decision support, not diagnosis{'\n'}Keep prescribed treatment unchanged.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#f3f7f8'},

  // Fixed header
  header:{flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:18,paddingVertical:12,backgroundColor:'#154c4a',borderBottomWidth:1,borderBottomColor:'#0e3835'},
  logo:{width:36,height:36,borderRadius:6},
  brand:{fontSize:18,color:'#ffffff',fontWeight:'700',letterSpacing:-0.5},
  badge:{fontSize:10,color:'#a8d5b5',fontWeight:'400'},
  subtitle:{fontSize:11,color:'#85b8a5',marginTop:1},

  // Fixed tab bar
  tabBar:{backgroundColor:'#ffffff',borderBottomWidth:1,borderBottomColor:'#e0ebe8',paddingHorizontal:12,paddingVertical:8},
  tab:{paddingHorizontal:14,paddingVertical:8,marginRight:6,borderRadius:8,backgroundColor:'#e5eeeb'},
  active:{backgroundColor:'#154c4a'},
  tabText:{color:'#154c4a',fontWeight:'600',fontSize:13},
  activeTabText:{color:'#ffffff'},

  // Language bar
  languageBar:{marginBottom:8,marginTop:4},
  language:{padding:8,marginRight:8},
  languageText:{fontSize:12,color:'#667e86'},
  languageActive:{color:'#154c4a',fontWeight:'700'},

  // Scrollable content
  container:{padding:18,paddingTop:12,paddingBottom:32},
  h1:{fontSize:26,color:'#253c46',fontWeight:'600',marginVertical:16},
  h2:{fontSize:18,color:'#253c46',fontWeight:'600',marginBottom:12},
  card:{backgroundColor:'white',borderColor:'#dfe8e9',borderWidth:1,borderRadius:14,padding:20,marginBottom:16},
  text:{fontSize:15,lineHeight:24,color:'#5a717a',marginBottom:12},
  button:{padding:16,backgroundColor:'#154c4a',borderRadius:9,marginVertical:6,minHeight:48},
  buttonText:{color:'white',fontWeight:'600',fontSize:14,textAlign:'center'},
  big:{fontSize:42,color:'#154c4a',marginBottom:12},
  code:{fontSize:11,lineHeight:18,color:'#486068'},
  message:{padding:14,backgroundColor:'#fff0ce',borderRadius:9,lineHeight:22,color:'#655027',marginBottom:14},
  footer:{fontSize:11,lineHeight:18,color:'#73888f',marginTop:20,textAlign:'center'},
  bars:{height:100,flexDirection:'row',alignItems:'flex-end',gap:3,marginTop:8},
  bar:{width:8,backgroundColor:'#659f8c',borderRadius:3},

  // Yoga styles
  sectionNote:{fontSize:13,color:'#5a717a',marginBottom:14,fontStyle:'italic'},
  yogaRow:{flexDirection:'row',alignItems:'flex-start',marginBottom:12,gap:12},
  yogaIndex:{width:28,height:28,borderRadius:14,backgroundColor:'#e5eeeb',alignItems:'center',justifyContent:'center',marginTop:1},
  yogaIndexText:{fontSize:12,color:'#154c4a',fontWeight:'700'},
  yogaInfo:{flex:1},
  yogaName:{fontSize:14,color:'#253c46',fontWeight:'600',marginBottom:2},
  yogaMeta:{fontSize:12,color:'#667e86',lineHeight:18},
  disclaimer:{fontSize:11,color:'#93a8b0',marginTop:10,fontStyle:'italic'},
});
