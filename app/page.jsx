
import MainPage from '../components/mainPage'


export const metadata = {
    title: 'Carla AI',
    description: 'The modern therapy companion',
    viewport: 'maximum-scale=1.0, minimum-scale=1.0, initial-scale=1.0, width=device-width, user-scalable=0',
    icons: {
        icon: '/logo.png',
        shortcut: '/logo.png',
        apple: '/logo.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/logo.png',
        }
    }
}

export default function Page(props) {

   

    return <MainPage {...props} />;
}
