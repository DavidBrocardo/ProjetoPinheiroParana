import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contato() {
    return (
        <>
            <Header />

            <main className="container">

                  <section className="sobre-parcerias card">
                    <h2>Entre em contato</h2>                 
                        <div className="card">
                            <h3>Instagram</h3>
                        </div>
                        <div className="card">
                            <h3>Email</h3>
                        </div>                                           
                </section>
            </main>

            

            <Footer />
        </>
    );
}