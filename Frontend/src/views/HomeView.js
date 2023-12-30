import React from 'react';
import { Card, CardContent, Typography, Container } from '@mui/material';

const Home = () => {
    return (
        <Container maxWidth="xd">
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                        <strong>Generator</strong>
                    </Typography>
                    <hr />
                    <Typography gutterBottom component="div">
                        <strong>Tikslas: Sukurti 3D avataro generavimo sistemos prototipą </strong>
                        apimant specifikavimo, projektavimo ir realizacijos fazes pagal
                        įsivaizduojamo kliento reikalavimus.
                    </Typography>
                    <Typography gutterBottom component="div">
                        <strong>Klientas:</strong> UAB „Aida“ – maisto gamybos įmonė
                    </Typography>
                    <Typography gutterBottom component="div">
                        <strong>Terminas/Užduoties apimtis:</strong> {'<='} 24 val. (3 d.d.)
                    </Typography>
                    <Typography gutterBottom component="div">
                        <strong>Reikalavimai sistemai. Sistemą sudaro:</strong>
                    </Typography>
                    <Typography gutterBottom component="div">
                        • E-platforma leidžianti naudotojui įkelti savo nuotraukas. <br />
                        • Naudotojas gali prisijungti/atsijungti nuo sistemos. <br />
                        • Naudotojas gali peržiūrėti savo nuotraukų sąrašą. <br />
                        • Naudotojas gali ištrinti nuotraukas. <br />
                        • Naudotojas gali užkelti savo veido nuotrauką ant 3D avataro ir peržiūrėti
                        ją 3D peržiūros įrankyje. <br />• Naudotojas savo užkeltą ant 3D nuotrauką
                        gali išsaugoti kaip projektą. <br />• Naudotojas gali matyti savo projektų
                        sąrašą.
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Home;
