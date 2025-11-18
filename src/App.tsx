import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Terminal from './pages/terminal/ui/Terminal';
import { TokenDetail } from './pages/token-detail';
import { SolanaProvider } from './app/provider/SolanaContext';
import { PrivyProvider } from './app/provider/PrivyContext';

// Type assertion для совместимости react-router v5 с React 18
const RouteComponent = Route as any;
const RedirectComponent = Redirect as any;

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './app/styles/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <PrivyProvider>
      <SolanaProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <RouteComponent exact path="/terminal" component={Terminal} />
            <RouteComponent exact path="/token/:mint" component={TokenDetail} />
            <RouteComponent exact path="/" render={() => <RedirectComponent to="/terminal" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </SolanaProvider>
    </PrivyProvider>
  </IonApp>
);

export default App;
