# backend/app/data/service_reviews.py
"""
Static service review library.

Contains predefined professional Google review texts for all 51 canonical
services. Reviews use {company_name} as the only safe substitution placeholder.

Rules:
- No AI generation
- No external API calls
- Deterministic: same service always returns the same review
- Reviews are professional, positive, concise, and service-specific
"""

CANONICAL_SERVICES = [
    "IT Services",
    "Software Development",
    "Web Development",
    "Digital Marketing",
    "Consulting",
    "Textile Trading",
    "Clothing & Apparel",
    "Real Estate",
    "Financial Services",
    "Accounting & Tax Services",
    "Legal Services",
    "Medical & Healthcare",
    "Clinic & Dental",
    "Cafe & Restaurant",
    "Food & Beverage",
    "Bakery & Confectionery",
    "Education & Coaching",
    "Gym & Fitness",
    "Beauty Salon & Spa",
    "Event Management",
    "Photography & Videography",
    "Interior Design",
    "Architecture & Construction",
    "Logistics & Transport",
    "E-commerce",
    "Retail Store",
    "Wholesale Trading",
    "Automobile Service",
    "Hotel & Hospitality",
    "Jewelry Store",
    "Manufacturing",
    "Graphic Design",
    "Public Relations",
    "Human Resources",
    "Cybersecurity",
    "Cloud Computing",
    "Agriculture & Farming",
    "Landscaping & Gardening",
    "Cleaning Services",
    "Pest Control",
    "Plumbing & Electrical",
    "Furniture & Home Decor",
    "Pet Care & Veterinary",
    "Travel & Tourism",
    "Insurance Agency",
    "Printing & Publishing",
    "Handicrafts & Artisans",
    "Pharmacy & Medical Supplies",
    "Entertainment & Media",
    "Waste Management",
    "Renewable Energy",
]

SERVICE_REVIEW_LIBRARY: dict[str, dict] = {
    "IT Services": {
        "review": (
            "I've been working with {company_name} for our IT needs and the experience has been excellent. "
            "Their team is responsive, knowledgeable, and always manages to resolve issues efficiently. "
            "Whether it's routine maintenance or an unexpected technical problem, they handle everything professionally. "
            "Highly recommended for any business looking for reliable IT support."
        ),
    },
    "Software Development": {
        "review": (
            "Partnering with {company_name} for our software development project was a great decision. "
            "Their developers took the time to understand our requirements thoroughly and delivered a solution "
            "that was both functional and well-structured. Communication throughout the project was clear and consistent. "
            "We're genuinely pleased with the final product and will work with them again."
        ),
    },
    "Web Development": {
        "review": (
            "We had {company_name} build our website and we couldn't be happier with the result. "
            "The design is clean and professional, the site loads quickly, and everything works exactly as we envisioned. "
            "The team was easy to collaborate with and offered helpful suggestions along the way. "
            "If you need a well-crafted website, these are the people to call."
        ),
    },
    "Digital Marketing": {
        "review": (
            "Working with {company_name} on our digital marketing strategy has made a noticeable difference in our online presence. "
            "Their approach is thoughtful and data-driven, and they take the time to explain what they're doing and why. "
            "We've seen genuine improvement in our reach and engagement. Very happy with the service."
        ),
    },
    "Consulting": {
        "review": (
            "The consulting team at {company_name} provided us with practical, actionable guidance that made a real impact on our business. "
            "They listened carefully, asked the right questions, and offered clear recommendations tailored to our situation. "
            "It's evident they bring real expertise and genuine care to every engagement. "
            "Would highly recommend to anyone seeking professional advisory services."
        ),
    },
    "Textile Trading": {
        "review": (
            "{company_name} has been a dependable partner for our textile sourcing needs. "
            "The quality of their products is consistently high, pricing is fair, and they are always straightforward to deal with. "
            "Orders are fulfilled accurately and on time. "
            "We've built a solid working relationship with them and plan to continue doing business together."
        ),
    },
    "Clothing & Apparel": {
        "review": (
            "Shopping with {company_name} has always been a pleasure. "
            "Their selection is varied, the quality of the clothing is excellent, and the staff are friendly and attentive. "
            "I always leave satisfied with my purchase. "
            "Whether you're looking for everyday wear or something special, they've got you covered. Strongly recommend."
        ),
    },
    "Real Estate": {
        "review": (
            "{company_name} made what can be a stressful process feel manageable and even enjoyable. "
            "Their agents were professional, patient, and genuinely invested in helping us find the right property. "
            "They were always available to answer questions and guided us clearly through every step. "
            "Excellent service from start to finish."
        ),
    },
    "Financial Services": {
        "review": (
            "I've relied on {company_name} for financial guidance and they've consistently impressed me. "
            "Their advisors are well-informed, transparent about options, and take the time to understand your specific needs "
            "before offering any recommendations. I feel confident in the decisions I've made with their support. Highly recommended."
        ),
    },
    "Accounting & Tax Services": {
        "review": (
            "{company_name} has been handling our accounting and tax work and they've made the whole process straightforward and stress-free. "
            "They are meticulous, always meet deadlines, and communicate proactively if there's anything we need to know. "
            "It's reassuring to have a team you can fully trust with your finances. Excellent service."
        ),
    },
    "Legal Services": {
        "review": (
            "I sought legal assistance from {company_name} and found their team to be highly competent and professional. "
            "They explained everything in clear terms, kept me informed throughout the process, and handled my matter with genuine care. "
            "I felt well-represented and confident in their capabilities. Would not hesitate to recommend them."
        ),
    },
    "Medical & Healthcare": {
        "review": (
            "The care provided by {company_name} is outstanding. "
            "Every member of their team is professional, compassionate, and thorough. "
            "I always feel heard and well looked after during my visits. "
            "The environment is clean and welcoming, and appointments run smoothly. "
            "It's a practice I trust completely and would recommend to family and friends."
        ),
    },
    "Clinic & Dental": {
        "review": (
            "My experience at {company_name} has been consistently positive. "
            "The dental team is gentle, professional, and explains every procedure clearly so there are no surprises. "
            "The clinic is clean and modern, and the staff go out of their way to make you feel comfortable. "
            "Highly recommend for anyone looking for quality dental care."
        ),
    },
    "Cafe & Restaurant": {
        "review": (
            "Dining at {company_name} was a genuinely enjoyable experience. "
            "The food was fresh, well-prepared, and full of flavour. "
            "The atmosphere is warm and inviting, and the staff are attentive without being intrusive. "
            "It's exactly the kind of place you want to come back to. "
            "Whether for a quick coffee or a full meal, they deliver every time."
        ),
    },
    "Food & Beverage": {
        "review": (
            "{company_name} consistently delivers food and beverages of excellent quality. "
            "Everything is fresh and carefully prepared, and you can tell real care goes into every product. "
            "The service is friendly and the overall experience is always enjoyable. "
            "It's become a go-to for us and we recommend it enthusiastically."
        ),
    },
    "Bakery & Confectionery": {
        "review": (
            "Everything from {company_name} has been absolutely delightful. "
            "The baked goods are fresh, beautifully made, and taste wonderful. "
            "You can tell their craft is something they take real pride in. "
            "Whether it's a special occasion order or just a treat for the day, they always deliver something worth savouring. "
            "Highly recommended."
        ),
    },
    "Education & Coaching": {
        "review": (
            "The educational support I received from {company_name} was exceptional. "
            "Their instructors are patient, knowledgeable, and clearly passionate about what they teach. "
            "The learning environment is structured yet encouraging, and I made genuine progress. "
            "If you're looking for quality coaching that makes a real difference, look no further."
        ),
    },
    "Gym & Fitness": {
        "review": (
            "{company_name} is exactly what a gym should be — well-equipped, clean, and staffed by people who genuinely care about your progress. "
            "The trainers are professional and encouraging, and the overall atmosphere motivates you to push yourself. "
            "Since joining, I've noticed real improvements. Highly recommend to anyone serious about their fitness."
        ),
    },
    "Beauty Salon & Spa": {
        "review": (
            "My visit to {company_name} was exactly what I needed. "
            "The salon is beautifully presented, spotlessly clean, and the staff are skilled and friendly. "
            "I left feeling refreshed and completely satisfied with the results. "
            "It's one of those places where you know you're in good hands from the moment you walk in. "
            "Already booked my next appointment."
        ),
    },
    "Event Management": {
        "review": (
            "{company_name} managed our event and they did a superb job. "
            "Every detail was taken care of thoughtfully, and the day itself ran without a hitch. "
            "They were creative, organised, and always available when we had questions or adjustments. "
            "The result exceeded our expectations. We will absolutely turn to them again for future events."
        ),
    },
    "Photography & Videography": {
        "review": (
            "We hired {company_name} to capture our event and they did a wonderful job. "
            "The photos and footage came out beautifully — sharp, well-composed, and full of genuine moments. "
            "They were professional on the day and a pleasure to work with. "
            "The final deliverables were everything we hoped for. Highly recommend their services."
        ),
    },
    "Interior Design": {
        "review": (
            "{company_name} transformed our space into something we genuinely love. "
            "Their design sense is refined and they listened carefully to our preferences before proposing ideas. "
            "The execution was smooth and the end result looks incredible. "
            "They made the whole process enjoyable. Anyone looking for talented interior designers should look no further."
        ),
    },
    "Architecture & Construction": {
        "review": (
            "We engaged {company_name} for our construction project and were thoroughly impressed. "
            "Their planning was meticulous, their workmanship was excellent, and they kept us informed at every stage. "
            "The finished structure is everything we asked for and more. "
            "A professional team that clearly values quality and client satisfaction. Highly recommended."
        ),
    },
    "Logistics & Transport": {
        "review": (
            "{company_name} has been our trusted logistics partner and they've never let us down. "
            "Deliveries are reliable, goods arrive in perfect condition, and the team is easy to communicate with. "
            "When unexpected challenges arise, they handle them calmly and professionally. "
            "Exactly the kind of dependable service every business needs."
        ),
    },
    "E-commerce": {
        "review": (
            "Shopping through {company_name}'s platform has been a smooth and enjoyable experience every time. "
            "The website is easy to navigate, products are accurately described, and delivery has always been prompt. "
            "Customer service is responsive and genuinely helpful. "
            "It's become my preferred destination for online shopping. Strongly recommend."
        ),
    },
    "Retail Store": {
        "review": (
            "{company_name} is a well-run retail store with a great product selection and helpful staff. "
            "The store is well-organised and easy to shop in, and the team is always on hand if you need assistance. "
            "Prices are fair and the overall shopping experience is consistently pleasant. "
            "My go-to store for quality products."
        ),
    },
    "Wholesale Trading": {
        "review": (
            "We've been sourcing products through {company_name} and they have proven to be a highly reliable wholesale partner. "
            "Product quality is consistently good, pricing is competitive, and orders are processed efficiently. "
            "Their team is straightforward to work with and responsive to our needs. "
            "A supplier we trust and would recommend without hesitation."
        ),
    },
    "Automobile Service": {
        "review": (
            "I've been bringing my vehicle to {company_name} for servicing and repairs and they've always delivered great work. "
            "The technicians are skilled and honest — they explain what needs to be done and don't recommend unnecessary work. "
            "The service is efficient and the car always comes back in excellent condition. "
            "My trusted choice for all things automotive."
        ),
    },
    "Hotel & Hospitality": {
        "review": (
            "My stay at {company_name} was thoroughly enjoyable. "
            "The rooms are comfortable and well-maintained, the staff are warm and attentive, "
            "and every aspect of the experience felt thoughtfully considered. "
            "From check-in to check-out, everything ran smoothly. "
            "It's the kind of hospitality that makes you look forward to returning. Highly recommended."
        ),
    },
    "Jewelry Store": {
        "review": (
            "{company_name} is a fantastic jewellery store with a beautiful selection and genuinely knowledgeable staff. "
            "They took the time to understand exactly what I was looking for and helped me find the perfect piece. "
            "The quality of the jewellery is excellent and the overall experience was a real pleasure. "
            "I won't shop elsewhere."
        ),
    },
    "Manufacturing": {
        "review": (
            "We work with {company_name} for our manufacturing needs and they consistently produce high-quality output. "
            "Their processes are efficient and well-managed, and they take quality control seriously. "
            "Communication is professional and they deliver on time. "
            "A reliable manufacturing partner that we're glad to work with."
        ),
    },
    "Graphic Design": {
        "review": (
            "{company_name} handled our graphic design requirements brilliantly. "
            "Their creative team brought fresh ideas while staying true to our brand identity. "
            "They were receptive to feedback and produced polished, professional work. "
            "The final designs have received a lot of positive attention. "
            "Highly recommended for anyone needing top-quality design work."
        ),
    },
    "Public Relations": {
        "review": (
            "The PR team at {company_name} has been instrumental in shaping our brand's public image. "
            "Their strategy is well-considered and they execute with real professionalism. "
            "They understand our industry, communicate proactively, and consistently deliver meaningful results. "
            "Working with them has been a genuinely positive experience and we'd recommend them to any business."
        ),
    },
    "Human Resources": {
        "review": (
            "{company_name} has provided excellent HR support for our organisation. "
            "Their team is professional, discreet, and highly knowledgeable. "
            "Whether it's recruitment, compliance, or employee management, they handle everything with care and competence. "
            "It's given us real peace of mind knowing our HR is in good hands. Strongly recommended."
        ),
    },
    "Cybersecurity": {
        "review": (
            "We brought in {company_name} to evaluate and strengthen our cybersecurity posture, and they delivered thorough, expert guidance. "
            "Their assessments were detailed, their recommendations were practical, and they explained everything clearly without unnecessary jargon. "
            "Our systems feel significantly more secure as a result. "
            "An excellent team for any organisation serious about protecting their data."
        ),
    },
    "Cloud Computing": {
        "review": (
            "{company_name} handled our move to the cloud and it went more smoothly than we expected. "
            "Their team is technically sharp, well-organised, and patient in explaining every step of the process. "
            "Our operations are now faster and more resilient. "
            "If you're considering a cloud migration, these are the people to have on your side."
        ),
    },
    "Agriculture & Farming": {
        "review": (
            "{company_name} has been an excellent partner for our agricultural needs. "
            "Their products are of consistently high quality and they have strong knowledge of what works in the field. "
            "They're approachable, honest, and genuinely invested in the success of their customers. "
            "A trusted name in agricultural supply that we'd recommend without hesitation."
        ),
    },
    "Landscaping & Gardening": {
        "review": (
            "The team at {company_name} transformed our outdoor space beautifully. "
            "Their work is neat, thoughtful, and delivered with obvious skill. "
            "They listened to our ideas and brought their own creativity to make the garden look truly special. "
            "Clean, efficient, and a pleasure to deal with. Highly recommend their landscaping services."
        ),
    },
    "Cleaning Services": {
        "review": (
            "{company_name} provides outstanding cleaning services. "
            "The team is thorough, punctual, and leaves every space sparkling. "
            "They use quality products and pay close attention to detail. "
            "Our office has never looked better since we started working with them. "
            "If you want a reliable, professional cleaning service, this is the one to call."
        ),
    },
    "Pest Control": {
        "review": (
            "We had a pest issue that was causing real concern, and {company_name} sorted it out efficiently and professionally. "
            "The technician was knowledgeable, explained the process clearly, and treated the problem thoroughly. "
            "No disruption, no fuss — just effective service. "
            "We wouldn't hesitate to call them again or recommend them to anyone who needs pest control."
        ),
    },
    "Plumbing & Electrical": {
        "review": (
            "{company_name} handled our plumbing and electrical work to an excellent standard. "
            "The team arrived on time, worked cleanly, and completed everything to a high level of quality. "
            "They were upfront about what was needed and didn't cut corners. "
            "It's reassuring to have a reliable tradesperson you can call with confidence. Highly recommended."
        ),
    },
    "Furniture & Home Decor": {
        "review": (
            "I love what I've purchased from {company_name}. "
            "The furniture and home decor pieces are beautifully made, stylish, and built to last. "
            "The showroom is well-laid-out and the staff are helpful without being pushy. "
            "Every piece I've bought has been exactly as expected — often even better in person. "
            "A genuine pleasure to shop with."
        ),
    },
    "Pet Care & Veterinary": {
        "review": (
            "I trust {company_name} completely with the care of my pets. "
            "The veterinary team is compassionate, highly professional, and clearly loves animals. "
            "They take time to explain everything and make both the animals and their owners feel at ease. "
            "The facility is clean and well-managed. "
            "Cannot recommend them highly enough for anyone who cares about their pet's wellbeing."
        ),
    },
    "Travel & Tourism": {
        "review": (
            "Booking through {company_name} made planning our trip effortless. "
            "Their team was helpful, knowledgeable, and offered excellent suggestions tailored to what we were looking for. "
            "Every detail of the itinerary was taken care of and the trip itself exceeded our expectations. "
            "Will definitely come back to them for future travel. Excellent service."
        ),
    },
    "Insurance Agency": {
        "review": (
            "{company_name} made the process of selecting an insurance policy far less daunting than I expected. "
            "Their advisors are patient, well-informed, and genuinely focused on finding the right coverage for your situation "
            "rather than just selling you something. I feel confident and well-covered. "
            "Highly recommend their services."
        ),
    },
    "Printing & Publishing": {
        "review": (
            "We've used {company_name} for several print projects and have always been pleased with the quality. "
            "The printing is sharp and accurate, materials are sturdy, and delivery is timely. "
            "The team is professional and helpful when we have specific requirements. "
            "A dependable printing partner that consistently delivers to a high standard."
        ),
    },
    "Handicrafts & Artisans": {
        "review": (
            "The craftsmanship at {company_name} is exceptional. "
            "Every piece is made with skill, care, and real artistry. "
            "You can see the dedication that goes into each product, and the quality is far above what you'd find elsewhere. "
            "Whether as a gift or for personal use, their work is truly special. An absolute pleasure to support."
        ),
    },
    "Pharmacy & Medical Supplies": {
        "review": (
            "{company_name} is my go-to pharmacy for a reason. "
            "The staff are knowledgeable, attentive, and always willing to take a moment to answer questions about medications or health products. "
            "The store is well-stocked and organised. I always feel well taken care of. "
            "Highly recommended for reliable pharmaceutical and medical supply services."
        ),
    },
    "Entertainment & Media": {
        "review": (
            "{company_name} delivers top-quality entertainment and media content. "
            "Their work is engaging, well-produced, and clearly crafted with care. "
            "Whether it's for an event, a campaign, or a production, they bring creativity and professionalism to everything they do. "
            "Working with them has always been a positive experience and we'd recommend them without hesitation."
        ),
    },
    "Waste Management": {
        "review": (
            "{company_name} provides a reliable and professional waste management service. "
            "Collection is prompt, the team is courteous, and they handle everything in a responsible manner. "
            "Since engaging them, our waste disposal process has become significantly more organised and efficient. "
            "A trustworthy service that we're very happy to recommend."
        ),
    },
    "Renewable Energy": {
        "review": (
            "We engaged {company_name} for our renewable energy installation and the whole experience was smooth and professional. "
            "Their team was knowledgeable, worked efficiently, and ensured everything was set up correctly. "
            "They were happy to answer all our questions and made sure we understood how the system works. "
            "We're very happy with the outcome and would recommend them to anyone considering going green."
        ),
    },
}


def get_service_review(service: str, company_name: str) -> str | None:
    """
    Return the personalized review text for a given service and company name.
    Returns None if the service is not in the library.
    """
    entry = SERVICE_REVIEW_LIBRARY.get(service)
    if not entry:
        return None
    return entry["review"].replace("{company_name}", company_name)


def validate_service_coverage() -> dict:
    """
    Validate that all 51 canonical services have review mappings.
    Returns a dict with coverage info.
    """
    mapped = set(SERVICE_REVIEW_LIBRARY.keys())
    canonical = set(CANONICAL_SERVICES)
    missing = canonical - mapped
    extra = mapped - canonical
    return {
        "total_canonical": len(canonical),
        "total_mapped": len(mapped),
        "missing": list(missing),
        "extra": list(extra),
        "complete": len(missing) == 0,
    }
