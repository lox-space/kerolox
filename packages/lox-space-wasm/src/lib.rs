use wasm_bindgen::prelude::*;

/// Initialize the WASM module with panic hook for better error messages
#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// A simple greeting function demonstrating string handling
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Lox Space WASM.", name)
}

/// Example math function: calculate orbital velocity
/// v = sqrt(μ / r)
#[wasm_bindgen]
pub fn orbital_velocity(gravitational_parameter: f64, radius: f64) -> f64 {
    (gravitational_parameter / radius).sqrt()
}

/// Example function: convert degrees to radians
#[wasm_bindgen]
pub fn deg_to_rad(degrees: f64) -> f64 {
    degrees * std::f64::consts::PI / 180.0
}

/// Example function: convert radians to degrees
#[wasm_bindgen]
pub fn rad_to_deg(radians: f64) -> f64 {
    radians * 180.0 / std::f64::consts::PI
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        let result = greet("World");
        assert!(result.contains("Hello, World!"));
    }

    #[test]
    fn test_orbital_velocity() {
        // Earth's standard gravitational parameter: 398600.4418 km³/s²
        // Low Earth orbit radius: ~6700 km
        let velocity = orbital_velocity(398600.4418, 6700.0);
        assert!((velocity - 7.714).abs() < 0.01);
    }

    #[test]
    fn test_deg_to_rad() {
        let radians = deg_to_rad(180.0);
        assert!((radians - std::f64::consts::PI).abs() < 1e-10);
    }

    #[test]
    fn test_rad_to_deg() {
        let degrees = rad_to_deg(std::f64::consts::PI);
        assert!((degrees - 180.0).abs() < 1e-10);
    }
}
