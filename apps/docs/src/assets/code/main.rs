use lox_space::bodies::{Earth, PointMass};

fn main() {
    let mu = Earth.gravitational_parameter();

    println!("Hello, Earthling!");
    println!(
        "The gravitational parameter of your planet is {} km^3/s^2.",
        mu
    );
}
