import Svg, { Path, Rect, Circle } from 'react-native-svg';

const Icons = () => {
    //Ikony do nawigacji - uzycie biblioteki react-native-svg' - dla web app
    //https://www.npmjs.com/package/react-native-svg
    const HomeIcon = () => (
        <Svg width="24" height="24" viewBox="0 0 24 24">
            <Path d="M10 20v-6h4v6h5v-8h3l-10-9-10 9h3v8z" />
        </Svg>
    );

    const AccountIcon = () => (
        <Svg width="24" height="24" viewBox="0 0 24 24">
            <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </Svg>
    );

    const InformationIcon = () => (
        <Svg width="24" height="24" viewBox="0 0 24 24">
            <Path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </Svg>
    );

    const CaloriesCalculatorIcon = () => (
        <Svg width="50" height="50" viewBox="0 0 50 50">
            <Circle cx="25" cy="25" r="20" stroke="black" strokeWidth="4" fill="none" />
            <Path d="M15 15 L35 35" stroke="black" strokeWidth="3" />
            <Path d="M35 15 L15 35" stroke="black" strokeWidth="3" />
        </Svg>
    );

    const DietIcon = () => (
        <Svg width="50" height="50" viewBox="0 0 50 50">
            <Circle cx="25" cy="25" r="20" stroke="black" strokeWidth="3" fill="none" />
            <Path d="M10 25 L20 35 L40 15" stroke="black" strokeWidth="3" fill="none" />
        </Svg>
    );

    const Icon7Days = () => (
        <svg width="50" height="50" viewBox="0 0 50 50">
            <Circle cx="25" cy="25" r="23" stroke="black" strokeWidth="3" fill="none" />
            <Path d="M15 10 L35 10 L20 40" stroke="black" strokeWidth="3" fill="none" />
        </svg>
    );

    const BackIcon = () => (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Path d="M19 12H6M12 5l-7 7 7 7" />
        </Svg>
    );

    return { Icons, AccountIcon, InformationIcon, DietIcon, Icon7Days, CaloriesCalculatorIcon, HomeIcon, BackIcon };
}

export default Icons;