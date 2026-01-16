import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Heart, Users, Award, BookOpen } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from teaching to student support.',
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'We maintain the highest standards of academic and professional integrity.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We foster a supportive and inclusive community for all students.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Students Enrolled' },
    { number: '500+', label: 'Expert Faculty' },
    { number: '50+', label: 'Programs Offered' },
    { number: '95%', label: 'Placement Rate' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/30 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Our Institution
            </h1>
            <p className="text-lg text-muted-foreground">
              Empowering students with knowledge, skills, and opportunities to succeed in an ever-changing world.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide accessible, high-quality education that empowers students to achieve their full potential and contribute meaningfully to society. We are committed to fostering innovation, critical thinking, and lifelong learning.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be a globally recognized institution of academic excellence, producing graduates who are leaders, innovators, and responsible citizens prepared to make a positive impact on the world.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape our academic community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Programs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer a diverse range of programs to suit your academic and career goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: BookOpen, title: 'Computer Science', description: 'Programming, AI, and software development' },
              { icon: Award, title: 'Business Administration', description: 'Management, marketing, and finance' },
              { icon: Target, title: 'Engineering', description: 'Mechanical, electrical, and civil engineering' },
              { icon: Heart, title: 'Healthcare', description: 'Nursing, medical technology, and health management' },
              { icon: Users, title: 'Arts & Humanities', description: 'Literature, history, and creative arts' },
              { icon: Eye, title: 'Data Science', description: 'Analytics, machine learning, and big data' },
            ].map((program, index) => (
              <Card key={index} className="group border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <program.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{program.title}</h3>
                  <p className="text-muted-foreground text-sm">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;