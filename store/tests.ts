export const test_message = {

    "success": false,

    "message": "Return Denied. Branding does not match official references. Suspected knockoff or wrong item.; Product failed inspection. Signs of use or damage detected in one or more views.",

    "details": {

        "branding_verification": {

            "details": {

                "found_text": "abibas",

                "text_check_passed": false,

                "visual_check_passed": false

            },

            "passed": false,

            "reason": "Branding does not match official references. Suspected knockoff or wrong item."

        },

        "condition_verification": {

            "details": {

                "inspected_angles": 4,

                "inspection_notes": [

                    "Angle 1: There appears to be a small light stain on the toe.  (Verdict: USED)",

                    "Angle 2: The shoe appears to be in new condition. There are no visible signs of wear such as scratches, stains, scuffs, or dirt in the provided image. (Verdict: NEW)",

                    "Angle 3: The sneaker appears to be in new condition. No visible signs of wear, scratches, stains, scuffs, dirt, or damage. (Verdict: NEW)",

                    "Angle 4: The sneaker appears to be in new condition and sealed in plastic wrap. No visible signs of wear, scratches, stains, scuffs, dirt, or damage are observed. (Verdict: NEW)"

                ]

            },

            "passed": true,

            "reason": "Product failed inspection. Signs of use or damage detected in one or more views."

        },

        "contents_verification": {

            "details": {

                "accessories_present": false,

                "main_product_present": true

            },

            "passed": false,

            "reason": "All items and accessories are not present."

        }

    }

}